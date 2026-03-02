<template>
  <div>
    <div class="mb-8">
      <UInput
        v-model="search"
        icon="i-lucide-search"
        size="xl"
        placeholder="Search series..."
        block
        variant="subtle"
        :ui="{
          base: 'bg-[#141414] border-transparent focus:border-red-600',
          leadingIcon: 'text-gray-500',
        }"
      />
    </div>

    <!-- Empty State -->
    <EmptyState
      v-if="filteredSeriesItems.length === 0 && !search"
      icon="i-lucide-monitor-play"
      title="No Series Available"
      description="No series are available in this category."
    />

    <!-- No Search Results -->
    <EmptyState
      v-else-if="filteredSeriesItems.length === 0 && search"
      icon="i-lucide-search-x"
      title="No Results Found"
      :description="`No series found matching '${search}'`"
      actionLabel="Clear Search"
      actionIcon="i-lucide-x"
      @action="search = ''"
    />

    <!-- Virtual Scrolling Content Grid -->
    <div
      v-else
      ref="scrollContainer"
      class="h-screen overflow-auto relative"
      @scroll="handleScroll"
    >
      <!-- Virtual scroll container -->
      <div
        :style="{
          height: `${totalHeight}px`,
          position: 'relative',
        }"
      >
        <!-- Only render visible rows -->
        <div
          v-for="row in visibleRows"
          :key="row.index"
          :style="{
            position: 'absolute',
            top: `${row.top}px`,
            left: 0,
            width: '100%',
          }"
        >
          <div
            class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 pb-4"
          >
            <div
              v-for="(item, idx) in getRowItems(row.index)"
              :key="item?.series_id || item?.id || idx"
            >
              <Card
                :item="item"
                :selectedItem="selectedItem"
                :name="item.name"
                :image="getSeriesImage(item)"
                :contentType="'series'"
                :providerType="providerType"
                @click="setSelectedSeries(item)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PIN Prompt Modal -->
    <PinPromptModal
      v-model:open="showPinPrompt"
      @submit="handlePinSubmit"
      @cancel="handlePinCancel"
    />
  </div>
</template>

<script lang="ts" setup>
const stalker = useStalkerStore();
const xtream = useXtreamStore();
const parentalControl = useParentalControl();

const selectedItem = ref("");
const search = ref("");

// PIN prompt state
const showPinPrompt = ref(false);
let pinPromptResolver: ((pin: string | null) => void) | null = null;

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

// Get series items based on provider
const seriesItems = computed(() => {
  if (providerType.value === "stalker") {
    if (!selectedCategory.value) return [];
    const key = `${selectedCategory.value.id}_1`;
    return stalker.seriesItems[key] || [];
  } else if (providerType.value === "xtream") {
    if (!selectedCategory.value) return [];
    const key = `cat_${
      selectedCategory.value.category_id || selectedCategory.value.id
    }`;
    return xtream.seriesStreams[key] || [];
  }
  return [];
});

// Filter items based on search
const filteredSeriesItems = computed(() => {
  if (!search.value.trim()) return seriesItems.value;

  const searchTerm = search.value.toLowerCase().trim();
  return seriesItems.value.filter((item: any) =>
    item.name?.toLowerCase().includes(searchTerm),
  );
});

// Virtual scrolling configuration
const ITEMS_PER_ROW = 6; // xl:grid-cols-6
const ROW_HEIGHT = 400; // Approximate height of each series card row (increased for proper spacing)

// Use custom virtual scrolling
const { scrollContainer, totalHeight, visibleRows, getRowItems, handleScroll } =
  useCustomVirtualScroll({
    items: filteredSeriesItems,
    itemsPerRow: ITEMS_PER_ROW,
    rowHeight: ROW_HEIGHT,
    overscan: 2,
  });

// Get series image based on provider
function getSeriesImage(item: any): string {
  if (providerType.value === "stalker") {
    return item.screenshot_uri || "";
  } else if (providerType.value === "xtream") {
    return item.cover || item.stream_icon || "";
  }
  return "";
}

// Handle series selection
async function setSelectedSeries(item: any) {
  // Check parental control before playback
  if (parentalControl.isEnabled.value) {
    const hasAccess = await parentalControl.checkContentAccess(
      item,
      selectedCategory.value,
      providerType.value || '',
      async () => {
        return new Promise((resolve) => {
          showPinPrompt.value = true;
          pinPromptResolver = resolve;
        });
      }
    );

    if (!hasAccess) return; // Block playback
  }

  selectedItem.value = item;

  if (providerType.value === "stalker") {
    stalker.currentSeries = item;
    if (item.id) {
      await stalker.getSeriesSeasons(item.id);
    }
    if (!stalker.modalOpen) {
      stalker.modalOpen = true;
    }
  } else if (providerType.value === "xtream") {
    xtream.currentStream = item;
    if (item.series_id) {
      await xtream.getSeriesInfo(item.series_id);
    }

    if (!xtream.modalOpen) {
      xtream.modalOpen = true;
    }
  }
}

function handlePinSubmit(pin: string) {
  if (pinPromptResolver) {
    pinPromptResolver(pin);
    pinPromptResolver = null;
  }
  showPinPrompt.value = false;
}

function handlePinCancel() {
  if (pinPromptResolver) {
    pinPromptResolver(null);
    pinPromptResolver = null;
  }
  showPinPrompt.value = false;
}

// Watch for category changes
watch(selectedCategory, () => {
  search.value = "";
  // Scroll to top when category changes
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = 0;
  }
});

// Watch for search changes
watch(search, () => {
  // Scroll to top when search changes
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = 0;
  }
});
</script>

<style scoped>
/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb {
  background: rgba(239, 68, 68, 0.5);
  border-radius: 5px;
  transition: background 0.2s;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(239, 68, 68, 0.7);
}

/* Smooth scrolling behavior */
[ref="scrollContainer"] {
  scroll-behavior: smooth;
}
</style>
