<template>
  <div>
    <div class="flex w-full flex-row gap-4">
      <UInput
        class="w-full mb-4"
        size="xl"
        placeholder="Search for movies"
        v-model="search"
        icon="i-lucide-search"
        clearable
      />
    </div>

    <!-- Loading State -->
    <div v-if="isCategoryLoading" class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      <CardSkeleton v-for="i in 12" :key="i" />
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else-if="filteredMoviesItems.length === 0 && !search"
      icon="i-lucide-film"
      title="No Movies Available"
      description="No movies are available in this category."
    />

    <!-- No Search Results -->
    <EmptyState
      v-else-if="filteredMoviesItems.length === 0 && search"
      icon="i-lucide-search-x"
      title="No Results Found"
      :description="`No movies found matching '${search}'`"
      actionLabel="Clear Search"
      actionIcon="i-lucide-x"
      @action="search = ''"
    />

    <!-- Content Grid -->
    <div
      v-else
      class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
    >
      <div v-for="item in filteredMoviesItems" :key="item?.stream_id || item?.id">
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
</template>

<script lang="ts" setup>
const stalker = useStalkerStore();
const xtream = useXtreamStore();
const toast = useToast();

const selectedItem = ref<any>(null);
const search = ref("");
const isLoading = ref(false);
const isCategoryLoading = computed(() => {
  return providerType.value === 'stalker' ? stalker.isLoading : xtream.isLoading;
});

// Abort controller for canceling previous requests
let abortController: AbortController | null = null;

function onScroll() {
  console.log("fssfsdf");
}

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
    item.name?.toLowerCase().includes(searchTerm)
  );
});

// Get movie image based on provider
function getMovieImage(item: any): string {
  if (providerType.value === "stalker") {
    return item.screenshot_uri
      ? `https://proxy.duckduckgo.com/iu/?u=${item.screenshot_uri}`
      : "";
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
      description: "Invalid movie item",
      color: "red",
      timeout: 3000,
    });
    return;
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
        setTimeout(() => reject(new Error("Request timeout")), 15000)
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
    if (error.name === 'AbortError') {
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
      color: "red",
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
});

// Cleanup on unmount
onUnmounted(() => {
  if (abortController) {
    abortController.abort();
  }
});
</script>

<style scoped></style>