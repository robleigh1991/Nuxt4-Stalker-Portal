<template>
  <div class="epg-grid flex flex-col h-full bg-black/40 rounded-lg border border-white/5 overflow-hidden">
    <!-- Header -->
    <div class="p-3 border-b border-white/5 flex items-center justify-between bg-white/5">
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-calendar-days" class="w-4 h-4 text-primary-400" />
        <span class="text-xs font-bold uppercase tracking-wider text-gray-300">Program Guide</span>
      </div>
      <div v-if="isLoading" class="flex items-center gap-2">
        <UIcon name="i-lucide-loader-2" class="w-3 h-3 animate-spin text-primary-400" />
        <span class="text-[10px] text-gray-500 italic">Updating...</span>
      </div>
    </div>

    <!-- Timeline / Programs -->
    <div class="flex-1 overflow-y-auto custom-scrollbar p-2">
      <div v-if="programs.length > 0" class="space-y-2">
        <div 
          v-for="(program, index) in sortedPrograms" 
          :key="index"
          class="program-card p-3 rounded-md transition-all duration-300 border border-transparent"
          :class="[
            isCurrent(program) 
              ? 'bg-primary-600/20 border-primary-500/30' 
              : 'bg-white/5 hover:bg-white/10'
          ]"
        >
          <div class="flex justify-between items-start mb-1">
            <h4 class="text-sm font-bold text-white leading-tight truncate mr-2" :title="getTitle(program)">
              {{ getTitle(program) }}
            </h4>
            <span class="text-[10px] font-mono text-gray-400 shrink-0">
              {{ formatTime(getStartTime(program)) }} - {{ formatTime(getEndTime(program)) }}
            </span>
          </div>

          <!-- Description (Truncated) -->
          <p v-if="getDescription(program)" class="text-[11px] text-gray-400 line-clamp-2 mb-2 leading-relaxed">
            {{ getDescription(program) }}
          </p>

          <!-- Progress Bar for Current Program -->
          <div v-if="isCurrent(program)" class="mt-2 text-primary-400">
             <div class="flex justify-between text-[9px] mb-1 font-bold">
               <span>Playing Now</span>
               <span>{{ getProgress(program) }}%</span>
             </div>
             <UProgress :value="getProgress(program)" color="primary" size="xs" />
          </div>
          <div v-else-if="isUpcoming(program)" class="mt-1 flex items-center gap-1">
             <UIcon name="i-lucide-clock" class="w-3 h-3 text-gray-500" />
             <span class="text-[9px] text-gray-500 font-bold uppercase">Up Next</span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!isLoading" class="flex flex-col items-center justify-center h-full py-8 text-center px-4">
        <div class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
          <UIcon name="i-lucide-scroll-text" class="w-6 h-6 text-gray-600" />
        </div>
        <p class="text-xs text-gray-400 font-medium">No program information available for this channel</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  channelId?: number | string;
  providerType: 'stalker' | 'xtream';
}>();

const stalker = useStalkerStore();
const xtream = useXtreamStore();
const isLoading = ref(false);
const currentTime = ref(Date.now());

// Update current time every minute
let timer: NodeJS.Timeout;
onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = Date.now();
  }, 60000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const programs = computed(() => {
  if (!props.channelId) return [];
  if (props.providerType === 'stalker') {
    return stalker.epgData[props.channelId] || [];
  } else {
    return xtream.epgData[props.channelId] || [];
  }
});

const sortedPrograms = computed(() => {
  return [...programs.value].sort((a, b) => getStartTime(a) - getStartTime(b));
});

// Helper functions for unified access
function getTitle(p: any): string {
  if (props.providerType === 'stalker') {
    return p.t_name || p.name || 'Unknown Program';
  }
  return p.title || 'Unknown Program';
}

function getDescription(p: any): string {
  if (props.providerType === 'stalker') {
    return p.descr || '';
  }
  return p.description || '';
}

function getStartTime(p: any): number {
  if (props.providerType === 'stalker') {
    // Stalker usually gives timestamp or ISO string
    return new Date(p.start || p.t_time).getTime();
  }
  // Xtream usually gives base64 encoded strings or ready dates
  try {
    const start = p.start || p.start_timestamp;
    return new Date(start).getTime();
  } catch (e) {
    return 0;
  }
}

function getEndTime(p: any): number {
  if (props.providerType === 'stalker') {
    return new Date(p.end || p.t_time_to).getTime();
  }
  try {
    const end = p.end || p.end_timestamp;
    return new Date(end).getTime();
  } catch (e) {
    return 0;
  }
}

function formatTime(timestamp: number): string {
  if (!timestamp) return '--:--';
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

function isCurrent(p: any): boolean {
  const start = getStartTime(p);
  const end = getEndTime(p);
  return currentTime.value >= start && currentTime.value < end;
}

function isUpcoming(p: any): boolean {
  const start = getStartTime(p);
  return start > currentTime.value;
}

function getProgress(p: any): number {
  const start = getStartTime(p);
  const end = getEndTime(p);
  if (currentTime.value < start) return 0;
  if (currentTime.value > end) return 100;
  
  const total = end - start;
  const elapsed = currentTime.value - start;
  return Math.round((elapsed / total) * 100);
}

// Initial Fetch
watch(() => props.channelId, async (newVal) => {
  if (newVal) {
    isLoading.value = true;
    if (props.providerType === 'stalker') {
      await stalker.getEPG(Number(newVal));
    } else {
      await xtream.getEPG(Number(newVal));
    }
    isLoading.value = false;
  }
}, { immediate: true });
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}

.program-card {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
