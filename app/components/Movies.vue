<template>
  <div class="flex flex-col h-full">
    <div class="flex w-full flex-row gap-4">
      <UInput
        class="w-full mb-4 flex-shrink-0"
        size="xl"
        placeholder="Search for movies"
        v-model="search"
      />
    </div>

    <RecycleScroller
      class="flex-1"
      :items="filteredMoviesItems"
      :item-size="itemHeight"
      key-field="uniqueId"
      :buffer="400"
      v-slot="{ item, index }"
    >
      <div
        class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 px-2"
        :style="{ height: itemHeight + 'px' }"
      >
        <Card
          v-for="gridItem in getRowItems(index)"
          :key="gridItem.uniqueId"
          :item="gridItem"
          :selectedItem="selectedItem"
          :name="gridItem.name"
          :image="getMovieImage(gridItem)"
          @click="setSelectedMovie(gridItem)"
        />
      </div>
    </RecycleScroller>
  </div>
</template>

<script lang="ts" setup>
import { RecycleScroller } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

const stalker = useStalkerStore();
const xtream = useXtreamStore();

const selectedItem = ref("");
const search = ref("");

// Responsive columns and row height
const columnsCount = ref(6);
const itemHeight = ref(240);

onMounted(() => {
  updateLayout();
  window.addEventListener("resize", updateLayout);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateLayout);
});

function updateLayout() {
  const width = window.innerWidth;
  if (width < 640) {
    columnsCount.value = 2;
    itemHeight.value = 280;
  } else if (width < 768) {
    columnsCount.value = 3;
    itemHeight.value = 300;
  } else if (width < 1024) {
    columnsCount.value = 4;
    itemHeight.value = 320;
  } else {
    columnsCount.value = 6;
    itemHeight.value = 340;
  }
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

// Filter items based on search and group into rows
const filteredMoviesItems = computed(() => {
  let items = moviesItems.value;

  if (search.value.trim()) {
    const searchTerm = search.value.toLowerCase().trim();
    items = items.filter((item: any) =>
      item.name?.toLowerCase().includes(searchTerm)
    );
  }

  // Add uniqueId and group into rows
  const itemsWithIds = items.map((item: any, idx: number) => ({
    ...item,
    uniqueId: item.stream_id || item.id || `item_${idx}`,
  }));

  // Create rows based on columns count
  const rows = [];
  for (let i = 0; i < itemsWithIds.length; i += columnsCount.value) {
    rows.push({
      uniqueId: `row_${i}`,
      items: itemsWithIds.slice(i, i + columnsCount.value),
      startIndex: i,
    });
  }

  return rows;
});

// Get items for a specific row
function getRowItems(index: number) {
  return filteredMoviesItems.value[index]?.items || [];
}

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
  }
}

// Watch for category changes
watch(selectedCategory, () => {
  search.value = "";
});
</script>

<style scoped>
/* No custom styles needed - using Tailwind classes */
</style>
