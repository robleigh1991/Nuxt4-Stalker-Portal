<template>
  <div class="card-skeleton animate-pulse">
    <div class="aspect-[2/3] bg-gray-700 rounded-lg mb-2"></div>
    <div class="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
    <div class="h-3 bg-gray-700 rounded w-1/2"></div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.card-skeleton {
  @apply w-full;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
