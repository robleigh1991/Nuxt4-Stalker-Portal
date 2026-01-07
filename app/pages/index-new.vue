<template>
  <div class="flex flex-row h-screen overflow-hidden bg-black">
    <!-- Sidebar -->
    <div
      class="sidebar flex flex-col w-64 bg-black border-r border-gray-900 overflow-hidden transition-all duration-300"
      :class="{ '-translate-x-full md:translate-x-0': !showSidebar }"
    >
      <div class="sidebar-header shrink-0 border-b border-gray-900 p-6">
        <h1 class="text-red-600 text-2xl font-bold tracking-tight">
          STREAMFLIX
        </h1>
      </div>

      <!-- Search in Sidebar -->
      <div class="p-4 border-b border-gray-900">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search..."
            class="w-full px-4 py-2 bg-gray-900 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
          />
          <Icon
            name="lucide:search"
            class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
          />
        </div>
      </div>

      <div
        class="sidebar-content flex-1 overflow-y-auto min-h-0 p-4 scrollbar-thin"
      >
        <!-- Loading State -->
        <div v-if="isLoadingCategories" class="space-y-2">
          <div
            v-for="i in 5"
            :key="i"
            class="h-10 bg-gray-900 rounded-lg animate-pulse"
          />
        </div>

        <!-- Categories -->
        <div v-else>
          <div v-if="selectedTab === 'live-tv'">
            <div
              v-for="category in filteredCategories"
              :key="category.id"
              class="p-3 mb-2 text-sm rounded-lg bg-gray-900 cursor-pointer hover:bg-gray-800 transition-all duration-200 text-gray-300 hover:text-white"
              :class="{
                'bg-red-900 text-white': selectedCategory?.id === category.id,
              }"
              @click="setSelectedCategory(category)"
            >
              <span>{{ category.title }}</span>
            </div>
          </div>
          <div v-if="selectedTab === 'movies'">
            <div
              v-for="category in filteredCategories"
              :key="category.id"
              class="p-3 mb-2 text-sm rounded-lg bg-gray-900 cursor-pointer hover:bg-gray-800 transition-all duration-200 text-gray-300 hover:text-white"
              :class="{
                'bg-red-900 text-white': selectedCategory?.id === category.id,
              }"
              @click="setSelectedCategory(category)"
            >
              <span>{{ category.title }}</span>
            </div>
          </div>
          <div v-if="selectedTab === 'series'">
            <div
              v-for="category in filteredCategories"
              :key="category.id"
              class="p-3 mb-2 text-sm rounded-lg bg-gray-900 cursor-pointer hover:bg-gray-800 transition-all duration-200 text-gray-300 hover:text-white"
              :class="{
                'bg-red-900 text-white': selectedCategory?.id === category.id,
              }"
              @click="setSelectedCategory(category)"
            >
              <span>{{ category.title }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="sidebar-footer shrink-0 border-t border-gray-900 bg-black">
        <div class="sidebar-footer-items flex items-center justify-between p-4">
          <button
            class="flex flex-col items-center gap-1 cursor-pointer transition-all duration-200"
            @click="setSelectedTab('live-tv')"
          >
            <Icon
              name="lucide:tv"
              class="w-6 h-6"
              :class="
                selectedTab === 'live-tv'
                  ? 'text-red-600'
                  : 'text-gray-500 hover:text-gray-300'
              "
            />
            <span
              class="text-xs font-medium"
              :class="
                selectedTab === 'live-tv'
                  ? 'text-red-600'
                  : 'text-gray-500 hover:text-gray-300'
              "
            >
              Live TV
            </span>
          </button>

          <button
            class="flex flex-col items-center gap-1 cursor-pointer transition-all duration-200"
            @click="setSelectedTab('movies')"
          >
            <Icon
              name="lucide:film"
              class="w-6 h-6"
              :class="
                selectedTab === 'movies'
                  ? 'text-red-600'
                  : 'text-gray-500 hover:text-gray-300'
              "
            />
            <span
              class="text-xs font-medium"
              :class="
                selectedTab === 'movies'
                  ? 'text-red-600'
                  : 'text-gray-500 hover:text-gray-300'
              "
            >
              Movies
            </span>
          </button>

          <button
            class="flex flex-col items-center gap-1 cursor-pointer transition-all duration-200"
            @click="setSelectedTab('series')"
          >
            <Icon
              name="lucide:monitor-play"
              class="w-6 h-6"
              :class="
                selectedTab === 'series'
                  ? 'text-red-600'
                  : 'text-gray-500 hover:text-gray-300'
              "
            />
            <span
              class="text-xs font-medium"
              :class="
                selectedTab === 'series'
                  ? 'text-red-600'
                  : 'text-gray-500 hover:text-gray-300'
              "
            >
              Series
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main flex-1 h-screen overflow-y-auto bg-black">
      <Header />

      <!-- Mobile Menu Toggle -->
      <button
        class="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 rounded-lg"
        @click="showSidebar = !showSidebar"
      >
        <Icon name="lucide:menu" class="w-6 h-6 text-white" />
      </button>

      <div class="main-content flex flex-col p-4 md:p-6">
        <!-- Video Player Section -->
        <div
          v-if="sourceUrl"
          class="video-section mb-6 rounded-xl overflow-hidden bg-gray-900 relative"
        >
          <!-- Video Loading Indicator -->
          <div
            v-if="isVideoLoading"
            class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10"
          >
            <div class="flex flex-col items-center gap-3">
              <div
                class="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"
              ></div>
              <p class="text-white text-sm">Loading stream...</p>
            </div>
          </div>

          <div class="relative">
            <video
              ref="videoElement"
              controls
              playsinline
              class="w-full bg-black"
            >
              Your browser does not support video playback.
            </video>

            <!-- Now Playing Info -->
            <div
              v-if="selectedItem"
              class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6"
            >
              <h2 class="text-2xl font-bold text-white mb-2">
                {{ selectedItem.name }}
              </h2>
              <div class="flex items-center gap-4 text-sm text-gray-300">
                <span v-if="selectedItem.year">{{ selectedItem.year }}</span>
                <span v-if="selectedItem.rating"
                  >⭐ {{ selectedItem.rating }}</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Category Title -->
        <div v-if="selectedCategory" class="mb-6">
          <h2 class="text-2xl font-bold text-white">
            {{ selectedCategory.title }}
          </h2>
        </div>

        <!-- Content Grid -->
        <div class="items-holder w-full">
          <!-- Loading Skeletons -->
          <div
            v-if="isLoadingItems"
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
          >
            <div v-for="i in 12" :key="i" class="space-y-2">
              <div class="aspect-[2/3] bg-gray-900 rounded-lg animate-pulse" />
              <div class="h-4 bg-gray-900 rounded animate-pulse" />
            </div>
          </div>

          <!-- Error State -->
          <div
            v-else-if="error"
            class="flex flex-col items-center justify-center py-20"
          >
            <Icon
              name="lucide:alert-circle"
              class="w-16 h-16 text-red-600 mb-4"
            />
            <h3 class="text-xl font-semibold text-white mb-2">
              Oops! Something went wrong
            </h3>
            <p class="text-gray-400 mb-4">{{ error }}</p>
            <button
              @click="retryLoad"
              class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>

          <!-- Empty State -->
          <div
            v-else-if="!selectedCategory"
            class="flex flex-col items-center justify-center py-20"
          >
            <Icon name="lucide:film" class="w-16 h-16 text-gray-600 mb-4" />
            <h3 class="text-xl font-semibold text-white mb-2">
              Select a category
            </h3>
            <p class="text-gray-400">
              Choose a category from the sidebar to get started
            </p>
          </div>

          <!-- Live TV Items -->
          <div
            v-else-if="selectedTab === 'live-tv' && getLiveItems.length > 0"
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
          >
            <div v-for="item in getLiveItems" :key="item?.id || Math.random()">
              <div
                v-if="item"
                class="group relative cursor-pointer transition-all duration-300 hover:scale-105"
                :class="{
                  'ring-2 ring-red-600': selectedItem === item,
                }"
                @click="setSelectedItem(item)"
              >
                <div
                  class="aspect-video bg-gray-900 rounded-lg overflow-hidden relative"
                >
                  <img
                    v-if="item.logo"
                    :src="item.logo"
                    :alt="item.name"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div
                    class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center"
                  >
                    <Icon
                      name="lucide:play-circle"
                      class="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
                <div class="mt-2">
                  <span
                    class="text-sm text-gray-300 group-hover:text-white line-clamp-2"
                  >
                    {{ item.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Movies Items -->
          <div
            v-else-if="selectedTab === 'movies' && getMoviesItems.length > 0"
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
          >
            <div
              v-for="item in getMoviesItems"
              :key="item?.id || Math.random()"
            >
              <div
                v-if="item"
                class="group relative cursor-pointer transition-all duration-300 hover:scale-105"
                :class="{
                  'ring-2 ring-red-600': selectedItem === item,
                }"
                @click="setSelectedItem(item)"
              >
                <div
                  class="aspect-[2/3] bg-gray-900 rounded-lg overflow-hidden relative"
                >
                  <img
                    v-if="item.screenshot_uri"
                    :src="item.screenshot_uri"
                    :alt="item.name"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div
                    class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center"
                  >
                    <Icon
                      name="lucide:play-circle"
                      class="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div
                    v-if="item.rating"
                    class="absolute top-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded text-xs text-white"
                  >
                    ⭐ {{ item.rating }}
                  </div>
                </div>
                <div class="mt-2">
                  <span
                    class="text-sm text-gray-300 group-hover:text-white line-clamp-2"
                  >
                    {{ item.name }}
                  </span>
                  <span v-if="item.year" class="block text-xs text-gray-500">
                    {{ item.year }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Series Items -->
          <div
            v-else-if="selectedTab === 'series' && getSeriesItems.length > 0"
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
          >
            <div
              v-for="item in getSeriesItems"
              :key="item?.id || Math.random()"
            >
              <div
                v-if="item"
                class="group relative cursor-pointer transition-all duration-300 hover:scale-105"
                @click="openSeriesModal(item)"
              >
                <div
                  class="aspect-[2/3] bg-gray-900 rounded-lg overflow-hidden relative"
                >
                  <img
                    v-if="item.screenshot_uri"
                    :src="item.screenshot_uri"
                    :alt="item.name"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div
                    class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center"
                  >
                    <Icon
                      name="lucide:list"
                      class="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
                <div class="mt-2">
                  <span
                    class="text-sm text-gray-300 group-hover:text-white line-clamp-2"
                  >
                    {{ item.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Series Seasons Modal -->
    <div
      v-if="showSeriesModal"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      @click.self="closeSeriesModal"
    >
      <div
        class="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        <div
          class="p-6 border-b border-gray-800 flex justify-between items-center"
        >
          <div>
            <h2 class="text-2xl font-bold text-white">
              {{ selectedSeriesItem?.name }}
            </h2>
            <p class="text-gray-400 mt-1">Select Season & Episode</p>
          </div>
          <button
            @click="closeSeriesModal"
            class="text-gray-400 hover:text-white"
          >
            <Icon name="lucide:x" class="w-6 h-6" />
          </button>
        </div>

        <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <!-- Loading Seasons -->
          <div v-if="isLoadingSeasons" class="space-y-3">
            <div
              v-for="i in 3"
              :key="i"
              class="h-12 bg-gray-800 rounded-lg animate-pulse"
            />
          </div>

          <!-- Seasons List -->
          <div v-else class="space-y-4">
            <div
              v-for="season in seriesSeasons"
              :key="season.id"
              class="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors cursor-pointer"
              @click="selectSeason(season)"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-white">
                    {{ season.name }}
                  </h3>
                  <p class="text-sm text-gray-400 mt-1">
                    {{ season.series_count || 0 }} episodes
                  </p>
                </div>
                <Icon
                  name="lucide:chevron-right"
                  class="w-6 h-6 text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const selectedTab = ref("live-tv");
const stalker = useStalkerStore();
const selectedCategory = ref<any>(null);
const selectedItem = ref<any>(null);
const sourceUrl = ref<any>(null);
const searchQuery = ref("");
const showSidebar = ref(true);
const isLoadingCategories = ref(false);
const isLoadingItems = ref(false);
const isLoadingSeasons = ref(false);
const isVideoLoading = ref(false);
const error = ref<string | null>(null);

// Series Modal
const showSeriesModal = ref(false);
const selectedSeriesItem = ref<any>(null);
const seriesSeasons = ref<any[]>([]);

const videoElement = ref<HTMLVideoElement | null>(null);
let player: any = null;

const options = {
  controls: [
    "play-large",
    "play",
    "progress",
    "current-time",
    "mute",
    "volume",
    "settings",
    "fullscreen",
  ],
  autoplay: true,
};

// Initialize Plyr
onMounted(async () => {
  if (process.client && videoElement.value) {
    try {
      const PlyrModule = await import("plyr");
      const Plyr = PlyrModule.default || PlyrModule;
      player = new Plyr(videoElement.value, options);

      player.on("ready", () => {
        console.log("Plyr ready");
      });

      player.on("error", (event: any) => {
        console.error("Plyr error:", event);
        isVideoLoading.value = false;
      });

      player.on("playing", () => {
        isVideoLoading.value = false;
      });

      player.on("waiting", () => {
        isVideoLoading.value = true;
      });
    } catch (error) {
      console.error("Failed to load Plyr:", error);
    }
  }
});

onUnmounted(() => {
  if (player) {
    player.destroy();
    player = null;
  }
});

// Watch for sourceUrl changes
// Watch for sourceUrl changes and update Plyr
watch(
  () => stalker.sourceUrl,
  (newUrl) => {
    sourceUrl.value = newUrl;
    if (player && videoElement.value && newUrl) {
      // Update the source
      const source = videoElement.value.querySelector("source");
      if (source) {
        source.src = newUrl;
      }

      player.play();
    }
  }
);

// Filtered categories based on search
const filteredCategories = computed(() => {
  let categories: any[] = [];

  if (selectedTab.value === "live-tv") {
    categories = stalker.liveCategories || [];
  } else if (selectedTab.value === "movies") {
    categories = stalker.moviesCategories || [];
  } else if (selectedTab.value === "series") {
    categories = stalker.seriesCategories || [];
  }

  if (!searchQuery.value) return categories;

  return categories.filter((cat) =>
    cat.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

async function setSelectedItem(item: any) {
  selectedItem.value = item;
  stalker.setSelectedItem(item);

  try {
    if (selectedTab.value === "live-tv") {
      await stalker.createLink(item.cmd, "itv");
    } else if (selectedTab.value === "movies") {
      await stalker.createLink(item.cmd, "vod");
    }
  } catch (err: any) {
    error.value = "Failed to load content. Please try again.";
    console.error(err);
  }
}

async function setSelectedTab(tab: string) {
  selectedTab.value = tab;
  selectedCategory.value = null;
  selectedItem.value = null;
  searchQuery.value = "";
  error.value = null;
}

async function setSelectedCategory(category: any) {
  selectedCategory.value = category;
  selectedItem.value = null;
  isLoadingItems.value = true;
  error.value = null;

  try {
    if (selectedTab.value === "live-tv") {
      await stalker.getLiveItems(category.id);
    } else if (selectedTab.value === "movies") {
      await stalker.getMoviesItems(category.id);
    } else if (selectedTab.value === "series") {
      await stalker.getSeriesItems(category.id);
    }
  } catch (err: any) {
    error.value = "Failed to load items. Please try again.";
    console.error(err);
  } finally {
    isLoadingItems.value = false;
  }
}

async function openSeriesModal(item: any) {
  selectedSeriesItem.value = item;
  showSeriesModal.value = true;
  isLoadingSeasons.value = true;

  try {
    const seasons = await stalker.getSeriesSeasons(item.id);
    seriesSeasons.value = seasons || [];
  } catch (err) {
    console.error("Failed to load seasons:", err);
  } finally {
    isLoadingSeasons.value = false;
  }
}

function closeSeriesModal() {
  showSeriesModal.value = false;
  selectedSeriesItem.value = null;
  seriesSeasons.value = [];
}

function selectSeason(season: any) {
  // TODO: Implement episode selection
  console.log("Selected season:", season);
  closeSeriesModal();
}

function retryLoad() {
  error.value = null;
  if (selectedCategory.value) {
    setSelectedCategory(selectedCategory.value);
  }
}

// Computed properties for items
const getLiveItems = computed(() => {
  if (!selectedCategory.value) return [];
  const key = `${selectedCategory.value.id}_1`;
  return stalker.liveItems[key] || [];
});

const getMoviesItems = computed(() => {
  if (!selectedCategory.value) return [];
  const key = `${selectedCategory.value.id}_1`;
  return stalker.moviesItems[key] || [];
});

const getSeriesItems = computed(() => {
  if (!selectedCategory.value) return [];
  const key = `${selectedCategory.value.id}_1`;
  return stalker.seriesItems[key] || [];
});
</script>

<style scoped>
.video-holder {
  display: grid;
  width: 100%;
  margin-bottom: 20px;
  min-height: 400px;
  max-height: 60vh;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: rgb(17 24 39);
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgb(55 65 81);
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: rgb(75 85 99);
}

@keyframes pulse {
  0%,
  100% {
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
