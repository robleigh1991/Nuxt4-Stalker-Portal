<template>
  <div class="flex w-full flex-row gap-4">
    <UInput
      class="w-full mb-4"
      size="xl"
      placeholder="Search for movies"
      v-model="search"
    />
  </div>
  <div
    class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
  >
    <div v-for="item in filteredMoviesItems" :key="item?.stream_id || item?.id">
      <Card
        :item="item"
        :selectedItem="selectedItem"
        :name="item.name"
        :image="getMovieImage(item)"
        @click="setSelectedMovie(item)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const stalker = useStalkerStore();
const xtream = useXtreamStore();

const selectedItem = ref("");
const search = ref("");

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

// Handle movie selection
async function setSelectedMovie(item: any) {
  selectedItem.value = item;

  if (providerType.value === "stalker") {
    stalker.currentMovie = item;
    await stalker.createLink(item.cmd, "vod");
    if (!stalker.modalOpen) {
      stalker.modalOpen = true;
    }
  } else if (providerType.value === "xtream") {
    await xtream.playVodStream(item);
    // Note: You'll need to add modalOpen to xtream store or handle differently
  }
}

// Watch for category changes
watch(selectedCategory, () => {
  search.value = "";
});
</script>

<style scoped></style>
