<template>
  <div
    class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
  >
    <div v-for="item in moviesItems" :key="item?.id || Math.random()">
      <Card
        :item="item"
        :selectedItem="selectedItem"
        :name="item.name"
        :image="item.screenshot_uri"
        @click="setSelectedMovie(item)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const stalker = useStalkerStore();
let selectedItem = ref("");
let moviesItems = ref([]);

onMounted(async () => {
  moviesItems.value = await stalker.moviesItems[
    stalker.selectedCategory.id + "_1"
  ];
});

async function setSelectedMovie(item: any) {
  selectedItem.value = item;
  stalker.currentMovie = item;
  await stalker.createLink(item.cmd, "vod");
  if (!stalker.modalOpen) {
    stalker.modalOpen = true;
  }
}

watch(
  () => stalker.selectedCategory,
  (newIems) => {
    moviesItems.value = stalker.moviesItems[stalker.selectedCategory.id + "_1"];
  }
);
</script>

<style scoped></style>
