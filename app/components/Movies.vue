<template>
  <div>
    <div class="flex w-full flex-row gap-4">
      <div class="mb-8 flex-1">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          size="xl"
          placeholder="Search movies..."
          block
          variant="subtle"
          :ui="{
            base: 'bg-[#141414] border-transparent focus:border-red-600',
            leadingIcon: 'text-gray-500',
          }"
        />
      </div>
    </div>

    <!-- Loading State - Only show when NO data loaded yet -->
    <div
      v-if="isCategoryLoading && filteredMoviesItems.length === 0"
      class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
    >
      <SkeletonsCardSkeleton v-for="i in 12" :key="i" />
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else-if="!isCategoryLoading && filteredMoviesItems.length === 0 && !search"
      icon="i-lucide-film"
      title="No Movies Available"
      description="No movies are available in this category."
    />

    <!-- No Search Results -->
    <EmptyState
      v-else-if="!isCategoryLoading && filteredMoviesItems.length === 0 && search"
      icon="i-lucide-search-x"
      title="No Results Found"
      :description="`No movies found matching '${search}'`"
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
        v-if="isCategoryLoading"
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
            class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 pb-4"
          >
            <div
              v-for="(item, idx) in getRowItems(row.index)"
              :key="item?.stream_id || item?.id || idx"
            >
              <Card
                :item="item"
                :selectedItem="selectedItem"
                :name="item.name"
                :image="getMovieImage(item)"
                :loading="isLoading && selectedItem?.id === item?.id"
                :contentType="'movies'"
                :providerType="providerType"
                @click="setSelectedMovie(item)"
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
const toast = useToast();
const parentalControl = useParentalControl();

const selectedItem = ref<any>(null);
const search = ref("");
const isLoading = ref(false);

// PIN prompt state
const showPinPrompt = ref(false);
let pinPromptResolver: ((pin: string | null) => void) | null = null;

const isCategoryLoading = computed(() => {
  return providerType.value === "stalker"
    ? stalker.isLoading
    : xtream.isLoading;
});

// Abort controller for canceling previous requests
let abortController: AbortController | null = null;

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

// Get movie items based on provider
const moviesItems = computed(() => {
  if (providerType.value === "stalker") {
    if (!selectedCategory.value) return [];
    const key = `${selectedCategory.value.id}_1`;
    return stalker.moviesItems[key] || [];
  } else if (providerType.value === "xtream") {
    if (!selectedCategory.value) return [];
    const key = `cat_${
      selectedCategory.value.category_id || selectedCategory.value.id
    }`;
    return xtream.vodStreams[key] || [];
  }
  return [];
});

// Filter items based on search
const filteredMoviesItems = computed(() => {
  if (!search.value.trim()) return moviesItems.value;

  const searchTerm = search.value.toLowerCase().trim();
  return moviesItems.value.filter((item: any) =>
    item.name?.toLowerCase().includes(searchTerm),
  );
});

// Virtual scrolling configuration
const ITEMS_PER_ROW = 6; // xl:grid-cols-6
const ROW_HEIGHT = 400; // Approximate height of each movie card row (increased for proper spacing)

// Use custom virtual scrolling
const { scrollContainer, totalHeight, visibleRows, getRowItems, handleScroll } =
  useCustomVirtualScroll({
    items: filteredMoviesItems,
    itemsPerRow: ITEMS_PER_ROW,
    rowHeight: ROW_HEIGHT,
    overscan: 2,
  });

// Get movie image based on provider
function getMovieImage(item: any): string {
  if (providerType.value === "stalker") {
    return item.screenshot_uri || "";
  } else if (providerType.value === "xtream") {
    return item.stream_icon || item.cover || "";
  }
  return "";
}

// Handle movie selection with proper error handling
async function setSelectedMovie(item: any) {
  // Prevent multiple clicks while loading
  if (isLoading.value) {
    console.log("Already loading, ignoring click");
    return;
  }

  // Validate item
  if (!item) {
    toast.add({
      title: "Error",
      description: "Invalid movie movie item",
      color: "error",
      timeout: 3000,
    });
    return;
  }

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

  // Cancel previous request if any
  if (abortController) {
    abortController.abort();
  }
  abortController = new AbortController();

  selectedItem.value = item;
  isLoading.value = true;

  try {
    if (providerType.value === "stalker") {
      // Validate cmd exists
      if (!item.cmd) {
        throw new Error("Movie command (cmd) is missing");
      }

      stalker.currentMovie = item;

      // Call createLink with timeout protection
      const createLinkPromise = stalker.createLink(item.cmd, "vod");
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout")), 15000),
      );

      await Promise.race([createLinkPromise, timeoutPromise]);

      // Open modal only after successful link creation
      if (!stalker.modalOpen) {
        stalker.modalOpen = true;
      }
    } else if (providerType.value === "xtream") {
      // Validate stream exists
      if (!item.stream_id && !item.id) {
        throw new Error("Stream ID is missing");
      }

      await xtream.playVodStream(item);

      // Open modal if available
      if (!xtream.modalOpen) {
        xtream.modalOpen = true;
      }
    }
  } catch (error: any) {
    console.error("Failed to load movie:", error);

    // Don't show error if request was aborted
    if (error.name === "AbortError") {
      console.log("Request was aborted");
      return;
    }

    // Reset state on error
    selectedItem.value = null;
    if (providerType.value === "stalker") {
      stalker.currentMovie = null;
    }

    // Show user-friendly error message
    const errorMessage = error.message || "Failed to load movie";
    toast.add({
      title: "Playback Error",
      description: errorMessage,
      color: "error",
      timeout: 5000,
    });
  } finally {
    isLoading.value = false;
    abortController = null;
  }
}

// Watch for category changes
watch(selectedCategory, () => {
  search.value = "";
  selectedItem.value = null;

  // Cancel any pending requests when category changes
  if (abortController) {
    abortController.abort();
    abortController = null;
  }

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

// Cleanup on unmount
onUnmounted(() => {
  if (abortController) {
    abortController.abort();
  }
});

// PIN prompt handlers
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
