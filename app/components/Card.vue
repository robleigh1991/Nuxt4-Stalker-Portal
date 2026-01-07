<template>
  <UCard
    v-if="item"
    variant="subtle"
    class="text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-primary-700 rounded-md"
    :class="{
      'bg-primary-100 dark:bg-primary-900': selectedItem === item,
    }"
  >
    <img
      v-if="image"
      :src="image"
      alt="logo"
      class="w-full h-full object-cover"
      onerror="this.onerror=null; this.src='https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'"
    />
    <img
      v-else
      src="https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
      alt="logo"
      class="w-full h-full object-cover"
    />
    <template #footer>
      <span class="item-name">{{ name }}</span>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
const props = defineProps<{
  item: any;
  selectedItem: any;
  name: string;
  image: string;
}>();
</script>

<style scoped>
img {
  max-width: 120px;
  min-width: 120px;
  max-height: 120px;
  min-height: 120px;
  margin: 0 auto;
  object-fit: contain;
  object-position: center;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2);
  }
}

.item-name {
  font-size: 16px;
  font-weight: 600;
  color: white;
  min-height: 80px;
  max-height: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
  text-align: center;
  padding: 10px;
  border-radius: 10px;
  margin-top: 10px;
}
</style>
