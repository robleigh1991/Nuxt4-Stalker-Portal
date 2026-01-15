<template>
  <div class="flex flex-col h-full">
    <UInput
      class="w-full mb-4 flex-shrink-0"
      size="xl"
      placeholder="Search for live channels"
      v-model="search"
    />

    <RecycleScroller
      class="flex-1"
      :items="filteredLiveItems"
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
          :image="getChannelImage(gridItem)"
          @click="setSelectedLive(gridItem)"
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
const itemHeight = ref(200);

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
    itemHeight.value = 180;
  } else if (width < 768) {
    columnsCount.value = 3;
    itemHeight.value = 200;
  } else if (width < 1024) {
    columnsCount.value = 4;
    itemHeight.value = 220;
  } else {
    columnsCount.value = 6;
    itemHeight.value = 240;
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

// Filter items based on search and add unique IDs
const filteredLiveItems = computed(() => {
  let items = liveItems.value;

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
  return filteredLiveItems.value[index]?.items || [];
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

// Watch for category changes
watch(selectedCategory, () => {
  search.value = "";
});
</script>

<style scoped>
/* No custom styles needed - using Tailwind classes */
</style>
