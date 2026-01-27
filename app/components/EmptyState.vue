<template>
  <div class="empty-state flex flex-col items-center justify-center py-16 px-4">
    <UIcon
      :name="icon"
      class="w-24 h-24 text-gray-500 dark:text-gray-600 mb-6"
    />
    <h3 class="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
      {{ title }}
    </h3>
    <p class="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
      {{ description }}
    </p>
    <UButton
      v-if="actionLabel"
      :icon="actionIcon"
      size="lg"
      @click="handleAction"
    >
      {{ actionLabel }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
/**
 * Empty State Component
 * 
 * Displays a user-friendly empty state when no content is available
 */

interface Props {
  icon?: string;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionIcon?: string;
}

interface Emits {
  (e: 'action'): void;
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'i-lucide-inbox',
  title: 'No content available',
  description: 'There is no content to display at the moment.',
});

const emit = defineEmits<Emits>();

const handleAction = () => {
  emit('action');
};
</script>

<style scoped>
.empty-state {
  min-height: 400px;
}
</style>
