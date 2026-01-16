<template>
  <UInput
    class="w-full mb-4"
    size="xl"
    placeholder="Search for live channels"
    v-model="search"
  />
  <div
    class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
  >
    <div v-for="item in filteredLiveItems" :key="item?.stream_id || item?.id">
      <Card
        :item="item"
        :selectedItem="selectedItem"
        :name="item.name"
        :image="getChannelImage(item)"
        @click="setSelectedLive(item)"
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
    // Note: You'll need to add modalOpen to xtream store or handle differently
  }
}

// Watch for category changes
watch(selectedCategory, () => {
  search.value = "";
});
</script>

<style scoped></style>
