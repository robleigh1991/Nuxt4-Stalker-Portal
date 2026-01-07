<template>
  <div
    v-if="availableChannels.length > 0"
    class="channels-sidebar w-80 bg-gray-800/95 dark:bg-gray-900/95 border-l border-gray-700 flex flex-col overflow-hidden"
  >
    <!-- Sidebar Header -->
    <div class="sidebar-header px-4 py-4 border-b border-gray-700">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-white">Channels</h2>
        <UButton
          icon="i-lucide-x"
          color="gray"
          variant="ghost"
          size="sm"
          @click="stalker.modalOpen = false"
        />
      </div>
      <p v-if="stalker.selectedCategory" class="text-sm text-gray-400 mt-1">
        {{ stalker.selectedCategory.title }}
      </p>
    </div>

    <!-- Channels List -->
    <div class="channels-list flex-1 overflow-y-auto p-4">
      <div
        v-for="channel in availableChannels"
        :key="channel?.id || Math.random()"
        class="channel-item mb-3 p-3 rounded-lg cursor-pointer transition-all duration-200 bg-gray-700/50 dark:bg-gray-800/50 hover:bg-primary-600/30 dark:hover:bg-primary-700/30 border border-transparent hover:border-primary-500"
        :class="{
          'bg-primary-600/50 dark:bg-primary-700/50 border-primary-500':
            currentChannel?.id === channel?.id,
        }"
        @click="switchChannel(channel)"
      >
        <div class="flex items-center gap-3">
          <img
            v-if="channel.logo"
            :src="channel.logo"
            :alt="channel.name"
            class="w-16 h-16 rounded-lg object-contain bg-gray-600 dark:bg-gray-700 p-1 shrink-0"
            onerror="this.onerror=null; this.src='https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'"
          />
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-semibold text-white truncate">
              {{ channel.name }}
            </h4>
            <p
              v-if="channel.description"
              class="text-xs text-gray-400 mt-1 line-clamp-2"
            >
              {{ channel.description }}
            </p>
          </div>
          <Icon
            v-if="currentChannel?.id === channel?.id"
            name="i-lucide-play-circle"
            class="w-5 h-5 text-primary-400 shrink-0"
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
const selectedCategory = computed(() => stalker.selectedCategory);
const currentChannel = computed(() => stalker.currentChannel);

const availableChannels = computed(() => {
  if (!selectedCategory.value) return [];
  const key = `${selectedCategory.value.id}_1`;
  const channels = stalker.liveItems[key];
  if (!channels || !Array.isArray(channels)) {
    return [];
  }
  return channels;
});

async function switchChannel(channel: any) {
  if (!channel || !channel.cmd) return;

  stalker.currentChannel = channel;
  await stalker.createLink(channel.cmd, "itv");

  if (!stalker.modalOpen) {
    stalker.modalOpen = true;
  }
}
</script>

<style scoped>
.channels-sidebar {
  backdrop-filter: blur(10px);
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
</style>
