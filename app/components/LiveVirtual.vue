<template>
  <div>
    <UInput
      class="w-full mb-4"
      size="xl"
      placeholder="Search for live channels"
      v-model="search"
      icon="i-lucide-search"
      clearable
    />

    <!-- Loading State -->
    <div v-if="isLoading" class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      <SkeletonsCardSkeleton v-for="i in 12" :key="i" />
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else-if="filteredLiveItems.length === 0 && !search"
      icon="i-lucide-tv"
      title="No Channels Available"
      description="No live channels are available in this category."
    />

    <!-- No Search Results -->
    <EmptyState
      v-else-if="filteredLiveItems.length === 0 && search"
      icon="i-lucide-search-x"
      title="No Results Found"
      :description="`No channels found matching '${search}'`"
      actionLabel="Clear Search"
      actionIcon="i-lucide-x"
      @action="search = ''"
    />

    <!-- Virtual Scrolling Content Grid -->
    <div v-else ref="scrollContainer" class="h-[calc(100vh-200px)] overflow-auto">
      <div :style="{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }">
        <div
          v-for="virtualRow in virtualizer.getVirtualItems()"
          :key="virtualRow.index"
          :data-index="virtualRow.index"
          :style="{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${virtualRow.size}px`,
            transform: `translateY(${virtualRow.start}px)`,
          }"
        >
          <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 px-4">
            <div
              v-for="(item, idx) in getRowItems(virtualRow.index)"
              :key="item?.stream_id || item?.id || idx"
            >
              <Card
                :item="item"
                :selectedItem="selectedItem"
                :name="item.name"
                :image="getChannelImage(item)"
                :contentType="'live'"
                :providerType="providerType"
                @click="setSelectedLive(item)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useVirtualizer } from '@tanstack/vue-virtual'

const stalker = useStalkerStore();
const xtream = useXtreamStore();

const selectedItem = ref("");
const search = ref("");
const scrollContainer = ref<HTMLElement | null>(null);

const isLoading = computed(() => {
  return providerType.value === 'stalker' ? stalker.isLoading : xtream.isLoading;
});

// Determine which provider is active
const providerType = computed(() => {
  if (stalker.token) return "stalker";
  if (xtream.isAuthenticated) return "xtream";
  return null;
});

// Get current selected category
const selectedCategory = computed(() => {
  return providerType.value === "stalker"
    ? stalker.selectedCategory
    : xtream.selectedCategory;
});

// Get live items based on provider
const liveItems = computed(() => {
  if (providerType.value === "stalker") {
    if (!selectedCategory.value) return [];
    const key = `${selectedCategory.value.id}_1`;
    return stalker.liveItems[key] || [];
  } else if (providerType.value === "xtream") {
    if (!selectedCategory.value) return [];
    const key = `cat_${
      selectedCategory.value.category_id || selectedCategory.value.id
    }`;
    return xtream.liveStreams[key] || [];
  }
  return [];
});

// Filter items based on search
const filteredLiveItems = computed(() => {
  if (!search.value.trim()) return liveItems.value;

  const searchTerm = search.value.toLowerCase().trim();
  return liveItems.value.filter((item: any) =>
    item.name?.toLowerCase().includes(searchTerm)
  );
});

// Virtual scrolling configuration
const ITEMS_PER_ROW = 6; // xl:grid-cols-6
const ROW_HEIGHT = 400; // Approximate height of each card

// Calculate number of rows
const rowCount = computed(() => {
  return Math.ceil(filteredLiveItems.value.length / ITEMS_PER_ROW);
});

// Virtual scrolling setup
const virtualizer = useVirtualizer({
  count: rowCount.value,
  getScrollElement: () => scrollContainer.value,
  estimateSize: () => ROW_HEIGHT,
  overscan: 2, // Render 2 extra rows above and below for smooth scrolling
});

// Get items for a specific row
function getRowItems(rowIndex: number) {
  const startIndex = rowIndex * ITEMS_PER_ROW;
  const endIndex = Math.min(startIndex + ITEMS_PER_ROW, filteredLiveItems.value.length);
  return filteredLiveItems.value.slice(startIndex, endIndex);
}

// Get channel image based on provider
function getChannelImage(item: any): string {
  if (providerType.value === "stalker") {
    return item.logo ? `https://proxy.duckduckgo.com/iu/?u=${item.logo}` : "";
  } else if (providerType.value === "xtream") {
    return item.stream_icon || "";
  }
  return "";
}

// Handle channel selection
async function setSelectedLive(item: any) {
  selectedItem.value = item;

  if (providerType.value === "stalker") {
    stalker.currentChannel = item;
    await stalker.createLink(item.cmd, "itv");
    if (!stalker.modalOpen) {
      stalker.modalOpen = true;
    }
  } else if (providerType.value === "xtream") {
    await xtream.playLiveStream(item);
  }
}

// Watch for category changes
watch(selectedCategory, () => {
  search.value = "";
});

// Watch for filtered items changes to update virtualizer
watch(() => filteredLiveItems.value.length, () => {
  virtualizer.measure();
});
</script>

<style scoped>
/* Ensure smooth scrolling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.5);
}
</style>
