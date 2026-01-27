<template>
  <UInput
    class="w-full mb-4"
    size="xl"
    placeholder="Search for series"
    v-model="search"
  />
  <div
    class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
  >
    <div v-for="item in filteredSeriesItems" :key="item?.series_id || item?.id">
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
</template>

<script lang="ts" setup>
const stalker = useStalkerStore();
const xtream = useXtreamStore();

const selectedItem = ref("");
const search = ref("");

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
    item.name?.toLowerCase().includes(searchTerm)
  );
});

// Get series image based on provider
function getSeriesImage(item: any): string {
  if (providerType.value === "stalker") {
    return item.screenshot_uri
      ? `https://proxy.duckduckgo.com/iu/?u=${item.screenshot_uri}`
      : "";
  } else if (providerType.value === "xtream") {
    return item.cover || item.stream_icon || "";
  }
  return "";
}

// Handle series selection
async function setSelectedSeries(item: any) {
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

// Watch for category changes
watch(selectedCategory, () => {
  search.value = "";
});
</script>

<style scoped></style>
