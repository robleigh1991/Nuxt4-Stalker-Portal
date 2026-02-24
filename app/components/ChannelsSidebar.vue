<template>
  <div
    v-if="availableChannels.length > 0"
    class="channels-sidebar w-full h-full bg-[#141414] flex flex-col overflow-hidden"
  >
    <!-- Sidebar Header -->
    <div class="sidebar-header px-4 py-4 border-b border-gray-700">
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-lg font-bold text-white">Channels</h2>
        <UButton
          icon="i-lucide-x"
          color="gray"
          variant="ghost"
          size="sm"
          @click="closeModal"
        />
      </div>
      <p v-if="selectedCategory" class="text-sm text-gray-400 mb-3">
        {{ selectedCategory.title || selectedCategory.category_name }}
      </p>

      <!-- Filter Tabs -->
      <div class="flex gap-2 overflow-x-auto no-scrollbar">
        <button
          v-for="filter in channelFilters"
          :key="filter.value"
          @click="activeFilter = filter.value"
          class="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1"
          :class="activeFilter === filter.value
            ? 'bg-red-600 text-white'
            : 'bg-white/5 text-gray-400 hover:bg-white/10'"
        >
          <UIcon :name="filter.icon" class="w-3.5 h-3.5" />
          {{ filter.label }}
          <span v-if="filter.count" class="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-[10px]">
            {{ filter.count() }}
          </span>
        </button>
      </div>
    </div>

    <!-- Channels List -->
    <div class="channels-list flex-1 overflow-y-auto p-4">
      <!-- Empty State -->
      <div v-if="filteredChannels.length === 0" class="text-center py-8">
        <UIcon :name="emptyStateIcon" class="w-12 h-12 mx-auto mb-3 text-gray-600" />
        <p class="text-gray-400 text-sm">{{ emptyStateMessage }}</p>
        <UButton
          v-if="activeFilter !== 'all'"
          @click="activeFilter = 'all'"
          variant="soft"
          color="primary"
          size="sm"
          class="mt-3"
        >
          View All Channels
        </UButton>
      </div>

      <!-- Channels -->
      <div
        v-for="channel in filteredChannels"
        :key="channel?.stream_id || channel?.id"
        class="channel-item mb-3 p-3 rounded-lg cursor-pointer transition-all duration-200 bg-gray-700/50 dark:bg-gray-800/50 hover:bg-primary-600/30 dark:hover:bg-primary-700/30 border border-transparent hover:border-primary-500 group"
        :class="{
          'bg-primary-600/50 dark:bg-primary-700/50 border-primary-500':
            isCurrentChannel(channel),
        }"
        @click="switchChannel(channel)"
      >
        <div class="flex items-center gap-3">
          <img
            v-if="getChannelLogo(channel)"
            :src="getProxiedChannelLogo(channel)"
            :alt="channel.name"
            class="w-16 h-16 rounded-lg object-contain bg-gray-600 dark:bg-gray-700 p-1 shrink-0"
            :onerror="`this.onerror=null; this.src='${placeholderImage}'`"
          />
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <h4 class="text-sm font-semibold text-white truncate">
                {{ channel.name }}
              </h4>
              <div class="flex items-center gap-1">
                <button
                  @click.stop="toggleFavorite(channel)"
                  class="p-1 hover:bg-white/10 rounded transition-colors"
                  :title="isFavoriteChannel(channel) ? 'Remove from favorites' : 'Add to favorites'"
                >
                  <Icon
                    name="i-lucide-heart"
                    class="w-4 h-4"
                    :class="isFavoriteChannel(channel) ? 'text-red-500 fill-red-500' : 'text-gray-500'"
                  />
                </button>
                <button
                  @click.stop="hideChannel(channel)"
                  class="p-1 hover:bg-white/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                  title="Hide channel"
                >
                  <Icon name="i-lucide-eye-off" class="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
            <p
              v-if="channel.description"
              class="text-xs text-gray-400 mt-1 line-clamp-2"
            >
              {{ channel.description }}
            </p>
          </div>
          <Icon
            v-if="isCurrentChannel(channel)"
            name="i-lucide-play-circle"
            class="w-5 h-5 text-primary-400 shrink-0"
          />
        </div>

        <!-- Mini EPG for Active Channel -->
        <div v-if="isCurrentChannel(channel)" class="mt-4 pt-4 border-t border-white/5">
          <EPGGrid
            :channelId="providerType === 'stalker' ? channel.id : channel.stream_id"
            :providerType="providerType"
            class="h-64"
          />
        </div>
      </div>

      <div
        v-if="availableChannels.length === 0"
        class="text-center py-8 text-gray-400"
      >
        <Icon name="i-lucide-tv" class="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No channels available</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const stalker = useStalkerStore();
const xtream = useXtreamStore();
const channelMgmt = useChannelManagementStore();
const { proxyImage, getPlaceholder } = useImageProxy();

const placeholderImage = computed(() => getPlaceholder());

// Channel filtering
const activeFilter = ref<'all' | 'favorites' | 'recent'>('all');

const channelFilters = computed(() => [
  {
    value: 'all',
    label: 'All',
    icon: 'i-lucide-grid-3x3',
    count: () => availableChannels.value.length,
  },
  {
    value: 'favorites',
    label: 'Favorites',
    icon: 'i-lucide-heart',
    count: () => favoriteChannelsList.value.length,
  },
  {
    value: 'recent',
    label: 'Recent',
    icon: 'i-lucide-history',
    count: () => recentChannelsList.value.length,
  },
]);

// Get favorite channels from the full list
const favoriteChannelsList = computed(() => {
  return availableChannels.value.filter((channel) => {
    const channelId = channelMgmt.generateChannelId(channel, providerType.value);
    return channelMgmt.isFavorite(channelId);
  });
});

// Get recent channels
const recentChannelsList = computed(() => {
  // Map recent channel IDs to actual channel objects
  return channelMgmt.recent.map((recentChannel) => {
    return recentChannel.data;
  }).filter(Boolean);
});

// Filtered channels based on active filter
const filteredChannels = computed(() => {
  if (activeFilter.value === 'favorites') {
    return favoriteChannelsList.value;
  } else if (activeFilter.value === 'recent') {
    return recentChannelsList.value;
  }
  return availableChannels.value;
});

// Empty state
const emptyStateIcon = computed(() => {
  if (activeFilter.value === 'favorites') return 'i-lucide-heart-off';
  if (activeFilter.value === 'recent') return 'i-lucide-history';
  return 'i-lucide-tv-off';
});

const emptyStateMessage = computed(() => {
  if (activeFilter.value === 'favorites') return 'No favorite channels yet. Click the heart icon to add favorites!';
  if (activeFilter.value === 'recent') return 'No recently watched channels yet. Start watching to see your history!';
  return 'No channels available';
});

// Initialize channel management
onMounted(() => {
  channelMgmt.init();
});

// Determine which provider is active
const providerType = computed(() => {
  if (stalker.token) return "stalker";
  if (xtream.isAuthenticated) return "xtream";
  return null;
});

const selectedCategory = computed(() => {
  return providerType.value === "stalker"
    ? stalker.selectedCategory
    : xtream.selectedCategory;
});

const currentChannel = computed(() => {
  return providerType.value === "stalker"
    ? stalker.currentChannel
    : xtream.currentStream;
});

const availableChannels = computed(() => {
  if (!selectedCategory.value) return [];

  let channels: any[] = [];

  if (providerType.value === "stalker") {
    const key = `${selectedCategory.value.id}_1`;
    channels = stalker.liveItems[key] || [];
  } else if (providerType.value === "xtream") {
    const key = `cat_${
      selectedCategory.value.category_id || selectedCategory.value.id
    }`;
    channels = xtream.liveStreams[key] || [];
  }

  // Filter out hidden channels and channels from hidden categories
  return channelMgmt.filterChannels(channels, providerType.value);
});

function getChannelLogo(channel: any): string {
  if (providerType.value === "stalker") {
    return channel.logo || "";
  } else if (providerType.value === "xtream") {
    return channel.stream_icon || "";
  }
  return "";
}

function getProxiedChannelLogo(channel: any): string {
  const logoUrl = getChannelLogo(channel);
  return proxyImage(logoUrl, {
    width: 128,
    height: 128,
    quality: 80,
    fit: 'contain',
  });
}

function isCurrentChannel(channel: any): boolean {
  if (!currentChannel.value) return false;

  if (providerType.value === "stalker") {
    return currentChannel.value.id === channel.id;
  } else if (providerType.value === "xtream") {
    return currentChannel.value.stream_id === channel.stream_id;
  }

  return false;
}

async function switchChannel(channel: any) {
  if (!channel) return;

  // Add to recent channels
  const channelInfo = {
    id: channelMgmt.generateChannelId(channel, providerType.value),
    providerType: providerType.value as 'stalker' | 'xtream',
    name: channel.name,
    logo: channel.logo || channel.stream_icon,
    data: channel,
  };
  channelMgmt.addToRecent(channelInfo);
  channelMgmt.setLastChannel(channelInfo);

  if (providerType.value === "stalker") {
    stalker.currentChannel = channel;
    await stalker.createLink(channel.cmd, "itv");
    if (!stalker.modalOpen) {
      stalker.modalOpen = true;
    }
  } else if (providerType.value === "xtream") {
    await xtream.playLiveStream(channel);
  }
}

function isFavoriteChannel(channel: any): boolean {
  const channelId = channelMgmt.generateChannelId(channel, providerType.value);
  return channelMgmt.isFavorite(channelId);
}

function toggleFavorite(channel: any) {
  const channelId = channelMgmt.generateChannelId(channel, providerType.value);
  channelMgmt.toggleFavorite(channelId);

  const toast = useToast();
  if (channelMgmt.isFavorite(channelId)) {
    toast.add({
      title: 'Added to Favorites',
      description: `${channel.name} added to favorites`,
      color: 'success',
      timeout: 2000,
    });
  } else {
    toast.add({
      title: 'Removed from Favorites',
      description: `${channel.name} removed from favorites`,
      color: 'primary',
      timeout: 2000,
    });
  }
}

function hideChannel(channel: any) {
  const channelId = channelMgmt.generateChannelId(channel, providerType.value);

  if (confirm(`Hide "${channel.name}"? You can unhide it from Account Settings.`)) {
    channelMgmt.hideChannel(channelId);

    const toast = useToast();
    toast.add({
      title: 'Channel Hidden',
      description: `${channel.name} has been hidden`,
      color: 'primary',
      timeout: 3000,
    });
  }
}

function closeModal() {
  if (providerType.value === "stalker") {
    stalker.modalOpen = false;
  } else if (providerType.value === 'xtream') {
    xtream.modalOpen = false;
  }
}
</script>

<style scoped>
.channels-sidebar {
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
}

.channel-item {
  transition: all 0.2s ease;
}

.channel-item:hover {
  transform: translateX(4px);
}

.channel-item:active {
  transform: translateX(2px) scale(0.98);
}

.channels-list {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.channels-list::-webkit-scrollbar {
  width: 6px;
}

.channels-list::-webkit-scrollbar-track {
  background: transparent;
}

.channels-list::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.channels-list::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
