<template>
  <div
    class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
  >
    <div v-for="item in seriesItems" :key="item?.id || Math.random()">
      <Card
        :item="item"
        :selectedItem="selectedItem"
        :name="item.name"
        :image="item.screenshot_uri"
        @click="setSelectedSeries(item)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const stalker = useStalkerStore();
let selectedItem = ref("");
let seriesItems = ref([]);

onMounted(async () => {
  seriesItems.value = await stalker.seriesItems[
    stalker.selectedCategory.id + "_1"
  ];
});

async function setSelectedSeries(item: any) {
  selectedItem.value = item;
  stalker.currentSeries = item;

  // Fetch seasons for this series
  if (item.id) {
    await stalker.getSeriesSeasons(item.id);
  }

  // Open modal if not already open
  if (!stalker.modalOpen) {
    stalker.modalOpen = true;
  }
}

watch(
  () => stalker.selectedCategory,
  (newIems) => {
    seriesItems.value = stalker.seriesItems[stalker.selectedCategory.id + "_1"];
  }
);
</script>

<style scoped></style>
