<template>
  <div
    v-if="showMonitor"
    :class="[
      'fixed bottom-4 right-4 backdrop-blur-md rounded-lg p-3 text-xs font-mono z-50 min-w-[220px] transition-all',
      memoryLevel === 'exceeded' || memoryLevel === 'critical'
        ? 'bg-red-900/90 border-2 border-red-500 animate-pulse'
        : memoryLevel === 'warning'
        ? 'bg-yellow-900/80 border border-yellow-500/50'
        : 'bg-black/80 border border-red-600/30'
    ]"
  >
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <span class="text-red-500 font-bold">Memory Monitor</span>
        <span
          v-if="memoryLevel === 'exceeded' || memoryLevel === 'critical'"
          class="text-red-500 animate-pulse"
        >
          🚨
        </span>
        <span v-else-if="memoryLevel === 'warning'" class="text-yellow-500">⚠️</span>
      </div>
      <button
        @click="showMonitor = false"
        class="text-gray-400 hover:text-white transition-colors"
      >
        <UIcon name="i-lucide-x" class="w-4 h-4" />
      </button>
    </div>

    <!-- Warning Message -->
    <div
      v-if="memoryLevel === 'exceeded'"
      class="mb-2 p-2 bg-red-500/20 border border-red-500 rounded text-red-200 text-[10px]"
    >
      🚨 LIMIT EXCEEDED! Auto-cleanup running...
    </div>
    <div
      v-else-if="memoryLevel === 'critical'"
      class="mb-2 p-2 bg-red-500/10 border border-red-500/50 rounded text-red-300 text-[10px]"
    >
      ⚠️ CRITICAL: Approaching 1GB limit
    </div>
    <div
      v-else-if="memoryLevel === 'warning'"
      class="mb-2 p-2 bg-yellow-500/10 border border-yellow-500/50 rounded text-yellow-300 text-[10px]"
    >
      ⚠️ High memory usage detected
    </div>

    <div class="space-y-1 text-gray-300">
      <div class="flex justify-between">
        <span>Used:</span>
        <span :class="memoryColor">{{ formatMemory(usedMemory) }}</span>
      </div>
      <div class="flex justify-between">
        <span>Limit:</span>
        <span class="text-red-400 font-bold">1.0 GB (Hard Limit)</span>
      </div>
      <div class="flex justify-between">
        <span>Usage:</span>
        <span :class="memoryColor">{{ usagePercent }}%</span>
      </div>

      <!-- Memory Bar -->
      <div class="w-full h-2 bg-gray-700 rounded-full overflow-hidden mt-2">
        <div
          :class="[
            'h-full transition-all duration-300',
            memoryLevel === 'exceeded' || memoryLevel === 'critical'
              ? 'bg-red-500'
              : memoryLevel === 'warning'
              ? 'bg-yellow-500'
              : 'bg-green-500'
          ]"
          :style="{ width: `${Math.min(usagePercent, 100)}%` }"
        ></div>
      </div>

      <!-- Cleanup Buttons -->
      <div class="mt-2 space-y-1">
        <button
          @click="performCleanup"
          class="w-full bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded text-xs transition-colors"
        >
          Clear Cache Now
        </button>
        <button
          v-if="memoryLevel === 'exceeded' || memoryLevel === 'critical'"
          @click="performEmergencyCleanup"
          class="w-full bg-red-800 hover:bg-red-900 text-white py-1 px-2 rounded text-xs transition-colors border border-red-500"
        >
          🚨 Emergency Cleanup
        </button>
      </div>
    </div>
  </div>

  <!-- Toggle Button (when hidden) -->
  <button
    v-if="!showMonitor"
    @click="showMonitor = true"
    class="fixed bottom-4 right-4 bg-black/80 backdrop-blur-md border border-red-600/30 rounded-full p-2 z-50 hover:bg-red-600/20 transition-colors"
    title="Show Memory Monitor"
  >
    <UIcon name="i-lucide-activity" class="w-5 h-5 text-red-500" />
  </button>
</template>

<script setup lang="ts">
const showMonitor = ref(true);
const usedMemory = ref(0);
const memoryLevel = ref<'safe' | 'warning' | 'critical' | 'exceeded'>('safe');
const {
  clearAllCache,
  emergencyCleanup,
  getCurrentMemory,
  checkMemoryUsage,
  MEMORY_HARD_LIMIT,
} = useMemoryCleanup();

const usagePercent = computed(() => {
  return Math.round((usedMemory.value / MEMORY_HARD_LIMIT) * 100);
});

const memoryColor = computed(() => {
  if (memoryLevel.value === 'exceeded' || memoryLevel.value === 'critical') {
    return 'text-red-500 font-bold';
  }
  if (memoryLevel.value === 'warning') return 'text-yellow-500';
  return 'text-green-500';
});

const formatMemory = (bytes: number): string => {
  const mb = bytes / (1024 * 1024);
  if (mb > 1000) {
    return `${(mb / 1024).toFixed(2)}GB`;
  }
  return `${mb.toFixed(0)}MB`;
};

const updateMemoryStats = () => {
  usedMemory.value = getCurrentMemory();
  const status = checkMemoryUsage();
  memoryLevel.value = status.level;

  // Auto-show monitor if memory is critical
  if (status.level === 'critical' || status.level === 'exceeded') {
    showMonitor.value = true;
  }
};

const performCleanup = () => {
  clearAllCache();
  // Force update stats after cleanup
  setTimeout(() => {
    updateMemoryStats();
  }, 200);
};

const performEmergencyCleanup = () => {
  emergencyCleanup();
  // Force update stats after cleanup
  setTimeout(() => {
    updateMemoryStats();
  }, 300);
};

// Update memory stats every 2 seconds
let interval: NodeJS.Timeout | null = null;

onMounted(() => {
  updateMemoryStats();
  interval = setInterval(updateMemoryStats, 2000);
});

onUnmounted(() => {
  if (interval) {
    clearInterval(interval);
  }
});
</script>
