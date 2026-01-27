<template>
  <div class="error-state flex flex-col items-center justify-center py-16 px-4">
    <div class="relative mb-6">
      <UIcon
        name="i-lucide-alert-circle"
        class="w-24 h-24 text-red-500"
      />
    </div>
    
    <h3 class="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
      {{ title }}
    </h3>
    
    <p class="text-gray-500 dark:text-gray-400 text-center max-w-md mb-2">
      {{ message }}
    </p>
    
    <p v-if="errorCode" class="text-sm text-gray-400 dark:text-gray-500 mb-6">
      Error Code: {{ errorCode }}
    </p>
    
    <div class="flex gap-3">
      <UButton
        v-if="canRetry"
        icon="i-lucide-refresh-cw"
        size="lg"
        color="primary"
        :loading="isRetrying"
        @click="handleRetry"
      >
        Try Again
      </UButton>
      
      <UButton
        v-if="showBackButton"
        icon="i-lucide-arrow-left"
        size="lg"
        color="gray"
        variant="outline"
        @click="handleBack"
      >
        Go Back
      </UButton>
    </div>

    <!-- Technical Details (collapsible) -->
    <details v-if="details && debugMode" class="mt-8 w-full max-w-2xl">
      <summary class="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
        Technical Details
      </summary>
      <pre class="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs overflow-auto">{{ details }}</pre>
    </details>
  </div>
</template>

<script setup lang="ts">
/**
 * Error State Component
 * 
 * Displays a user-friendly error message with retry and back options
 */

interface Props {
  title?: string;
  message: string;
  errorCode?: string;
  details?: any;
  canRetry?: boolean;
  showBackButton?: boolean;
}

interface Emits {
  (e: 'retry'): void;
  (e: 'back'): void;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Something went wrong',
  canRetry: true,
  showBackButton: false,
});

const emit = defineEmits<Emits>();

const config = useRuntimeConfig();
const debugMode = config.public.debugMode;
const isRetrying = ref(false);

const handleRetry = async () => {
  isRetrying.value = true;
  try {
    emit('retry');
  } finally {
    // Reset after a short delay
    setTimeout(() => {
      isRetrying.value = false;
    }, 1000);
  }
};

const handleBack = () => {
  emit('back');
};
</script>

<style scoped>
.error-state {
  min-height: 400px;
}

details summary {
  user-select: none;
}

details[open] summary {
  margin-bottom: 0.5rem;
}
</style>
