<template>
  <UModal v-model:open="isOpen" :close="true" size="2xl">
    <template #content>
      <div class="bg-[#141414] p-6 max-h-[80vh] flex flex-col">
        <!-- Header -->
        <div class="mb-4">
          <h2 class="text-2xl font-bold mb-2">Search</h2>
          <p class="text-sm text-gray-400">Search across Live TV, Movies, and Series</p>
        </div>

        <!-- Search Input -->
        <div class="relative mb-4">
          <UInput
            v-model="localQuery"
            icon="i-lucide-search"
            size="xl"
            placeholder="Search for channels, movies, series..."
            block
            autofocus
            @input="handleInput"
            @keydown.esc="closeModal"
          />
          <button
            v-if="localQuery"
            @click="clearSearch"
            class="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded"
          >
            <UIcon name="i-lucide-x" class="w-5 h-5" />
          </button>
        </div>

        <!-- Filter Tabs -->
        <div class="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
          <button
            v-for="filter in filters"
            :key="filter.value"
            @click="selectedFilter = filter.value; handleSearch()"
            class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all"
            :class="selectedFilter === filter.value
              ? 'bg-red-600 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'"
          >
            <UIcon :name="filter.icon" class="w-4 h-4 inline mr-1" />
            {{ filter.label }}
          </button>
        </div>

        <!-- Search History (shown when no query) -->
        <div v-if="!localQuery && searchHistory.length > 0" class="mb-4">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-semibold text-gray-400">Recent Searches</h3>
            <button
              @click="clearSearchHistory"
              class="text-xs text-gray-500 hover:text-white"
            >
              Clear
            </button>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="(item, index) in searchHistory"
              :key="index"
              @click="localQuery = item; handleSearch()"
              class="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-sm transition-colors"
            >
              {{ item }}
            </button>
          </div>
        </div>

        <!-- Results -->
        <div class="flex-1 overflow-y-auto -mx-6 px-6">
          <!-- Loading State -->
          <div v-if="isSearching" class="flex items-center justify-center py-12">
            <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-red-600" />
          </div>

          <!-- No Results -->
          <div v-else-if="localQuery && results.length === 0" class="text-center py-12">
            <UIcon name="i-lucide-search-x" class="w-12 h-12 mx-auto mb-3 text-gray-600" />
            <p class="text-gray-400">No results found for "{{ localQuery }}"</p>
          </div>

          <!-- Results Grid -->
          <div v-else-if="results.length > 0" class="space-y-6">
            <!-- Group by type -->
            <div v-for="type in contentTypes" :key="type">
              <template v-if="getResultsByType(type).length > 0">
                <h3 class="text-lg font-semibold mb-3 capitalize">{{ type === 'live' ? 'Live TV' : type }}</h3>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  <div
                    v-for="result in getResultsByType(type)"
                    :key="result.id"
                    @click="handleResultClick(result)"
                    class="cursor-pointer group"
                  >
                    <div class="aspect-[2/3] bg-gray-800 rounded overflow-hidden mb-2 relative">
                      <img
                        v-if="result.image"
                        :src="result.image"
                        :alt="result.name"
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div v-else class="w-full h-full flex items-center justify-center">
                        <UIcon name="i-lucide-image-off" class="w-12 h-12 text-gray-600" />
                      </div>
                      <!-- Type Badge -->
                      <div class="absolute top-2 right-2 px-2 py-1 bg-black/80 backdrop-blur-sm rounded text-xs uppercase">
                        {{ type }}
                      </div>
                      <!-- Play Overlay -->
                      <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <UIcon name="i-lucide-play-circle" class="w-12 h-12 text-white" />
                      </div>
                    </div>
                    <h4 class="text-sm font-medium line-clamp-2">{{ result.name }}</h4>
                    <p v-if="result.description" class="text-xs text-gray-500 line-clamp-1 mt-1">
                      {{ result.description }}
                    </p>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-12">
            <UIcon name="i-lucide-search" class="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p class="text-gray-400">Start typing to search</p>
            <p class="text-sm text-gray-500 mt-2">Press <kbd class="px-2 py-1 bg-white/10 rounded">Ctrl+K</kbd> to open search</p>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  'select': [result: any];
}>();

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
});

const { isSearching, results, searchHistory, search, debouncedSearch, clear, clearSearchHistory } = useGlobalSearch();

const localQuery = ref('');
const selectedFilter = ref<'all' | 'live' | 'movies' | 'series'>('all');

const filters = [
  { value: 'all', label: 'All', icon: 'i-lucide-grid-3x3' },
  { value: 'live', label: 'Live TV', icon: 'i-lucide-tv' },
  { value: 'movies', label: 'Movies', icon: 'i-lucide-film' },
  { value: 'series', label: 'Series', icon: 'i-lucide-monitor-play' },
];

const contentTypes = ['live', 'movies', 'series'];

const handleInput = () => {
  if (localQuery.value.length >= 2) {
    debouncedSearch(localQuery.value);
  } else {
    clear();
  }
};

const handleSearch = () => {
  if (localQuery.value.length >= 2) {
    search(localQuery.value);
  }
};

const getResultsByType = (type: string) => {
  if (selectedFilter.value !== 'all' && selectedFilter.value !== type) {
    return [];
  }
  return results.value.filter(r => r.type === type);
};

const handleResultClick = (result: any) => {
  emit('select', result);
  closeModal();
};

const clearSearch = () => {
  localQuery.value = '';
  clear();
};

const closeModal = () => {
  isOpen.value = false;
  // Clear after animation
  setTimeout(() => {
    localQuery.value = '';
    clear();
  }, 300);
};

// Reset when modal opens
watch(() => props.open, (newVal) => {
  if (newVal) {
    localQuery.value = '';
    selectedFilter.value = 'all';
    clear();
  }
});
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

kbd {
  font-family: monospace;
  font-size: 0.875rem;
}
</style>
