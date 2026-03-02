<template>
  <div>
    <div class="mb-8">
      <UInput
        v-model="search"
        icon="i-lucide-search"
        size="xl"
        placeholder="Search channels..."
        block
        variant="subtle"
        :ui="{
          base: 'bg-[#141414] border-transparent focus:border-red-600',
          leadingIcon: 'text-gray-500',
        }"
      />
    </div>

    <!-- Loading State - Only show when NO data loaded yet -->
    <div
      v-if="isLoading && filteredLiveItems.length === 0"
      class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
    >
      <SkeletonsCardSkeleton v-for="i in 12" :key="i" />
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else-if="!isLoading && filteredLiveItems.length === 0 && !search"
      icon="i-lucide-tv"
      title="No Channels Available"
      description="No live channels are available in this category."
    />

    <!-- No Search Results -->
    <EmptyState
      v-else-if="!isLoading && filteredLiveItems.length === 0 && search"
      icon="i-lucide-search-x"
      title="No Results Found"
      :description="`No channels found matching '${search}'`"
      actionLabel="Clear Search"
      actionIcon="i-lucide-x"
      @action="search = ''"
    />

    <!-- Virtual Scrolling Content Grid - Show as soon as data starts loading -->
    <div
      v-else
      ref="scrollContainer"
      class="h-screen overflow-auto relative"
      @scroll="handleScroll"
    >
      <!-- Loading indicator overlay while more data loads -->
      <div
        v-if="isLoading"
        class="absolute top-4 right-4 z-10 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg flex items-center gap-2"
      >
        <div class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        Loading more...
      </div>

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
            class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 pb-8"
          >
            <div
              v-for="(item, idx) in getRowItems(row.index)"
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

const isLoading = computed(() => {
  return providerType.value === "stalker"
    ? stalker.isLoading
    : xtream.isLoading;
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
    item.name?.toLowerCase().includes(searchTerm),
  );
});

// Virtual scrolling configuration
const ITEMS_PER_ROW = 6; // xl:grid-cols-6
const ROW_HEIGHT = 420; // Approximate height of each card row (aspect-ratio 2:3 + spacing)

// Use custom virtual scrolling
const { scrollContainer, totalHeight, visibleRows, getRowItems, handleScroll } =
  useCustomVirtualScroll({
    items: filteredLiveItems,
    itemsPerRow: ITEMS_PER_ROW,
    rowHeight: ROW_HEIGHT,
    overscan: 2,
  });

// Get channel image based on provider
function getChannelImage(item: any): string {
  if (providerType.value === "stalker") {
    return item.logo || "";
  } else if (providerType.value === "xtream") {
    return item.stream_icon || "";
  }
  return "";
}

// Handle channel selection
async function setSelectedLive(item: any) {
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

  console.log(selectedItem.value);
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
