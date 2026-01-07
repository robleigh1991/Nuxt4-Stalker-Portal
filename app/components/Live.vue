<template>
  <div
    class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
  >
    <div v-for="item in liveItems" :key="item?.id || Math.random()">
      <Card
        :item="item"
        :selectedItem="selectedItem"
        :name="item.name"
        :image="item.logo"
        @click="setSelectedLive(item)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const stalker = useStalkerStore();
let selectedItem = ref("");
let liveItems = ref([]);

onMounted(async () => {
  liveItems.value = await stalker.liveItems[stalker.selectedCategory.id + "_1"];
});

async function setSelectedLive(item: any) {
  selectedItem.value = item;
  stalker.currentChannel = item;
  await stalker.createLink(item.cmd, "itv");

  if (!stalker.modalOpen) {
    stalker.modalOpen = true;
  }
}

watch(
  () => stalker.selectedCategory,
  (newIems) => {
    liveItems.value = stalker.liveItems[stalker.selectedCategory.id + "_1"];
  }
);
</script>

<style scoped></style>
