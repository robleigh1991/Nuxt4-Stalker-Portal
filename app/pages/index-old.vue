<template>
  <div class="flex flex-row h-screen overflow-hidden">
    <div
      class="sidebar flex flex-col w-64 border-r border-gray-100 dark:border-gray-800 overflow-hidden"
    >
      <div
        class="sidebar-header shrink-0 border-b border-gray-100 dark:border-gray-800"
      >
        <h1>Sidebar</h1>
      </div>
      <div class="sidebar-content flex-1 overflow-y-auto min-h-0 p-4">
        <div v-if="selectedTab === 'live-tv'">
          <div
            v-for="category in stalker.liveCategories"
            :key="category.id"
            class="p-2 mb-2 text-sm rounded-md bg-gray-100 dark:bg-gray-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-primary-700"
            @click="setSelectedCategory(category)"
          >
            <span>{{ category.title }}</span>
          </div>
        </div>
        <div v-if="selectedTab === 'movies'">
          <div
            v-for="category in stalker.moviesCategories"
            :key="category.id"
            class="p-2 mb-2 text-sm rounded-md bg-gray-100 dark:bg-gray-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-primary-700"
            @click="setSelectedCategory(category)"
          >
            <span>{{ category.title }}</span>
          </div>
        </div>
        <div v-if="selectedTab === 'series'">
          <div
            v-for="category in stalker.seriesCategories"
            :key="category.id"
            class="p-2 mb-2 text-sm rounded-md bg-gray-100 dark:bg-gray-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-primary-700"
            @click="setSelectedCategory(category)"
          >
            <span>{{ category.title }}</span>
          </div>
        </div>
      </div>
      <div
        class="sidebar-footer shrink-0 border-t border-gray-100 dark:border-gray-800"
      >
        <div class="sidebar-footer-items flex items-center justify-between p-4">
          <button
            class="flex flex-col items-center gap-1 cursor-pointer"
            @click="setSelectedTab('live-tv')"
          >
            <Icon
              name="lucide:tv"
              class="w-6 h-6"
              :class="{ 'text-primary': selectedTab === 'live-tv' }"
              aria-hidden="true"
            />
            <span
              class="text-xs"
              :class="{ 'text-primary': selectedTab === 'live-tv' }"
            >
              Live TV
            </span>
          </button>

          <button
            class="flex flex-col items-center gap-1 cursor-pointer"
            @click="setSelectedTab('movies')"
          >
            <Icon
              name="lucide:film"
              class="w-6 h-6"
              :class="{ 'text-primary': selectedTab === 'movies' }"
              aria-hidden="true"
            />
            <span
              class="text-xs"
              :class="{ 'text-primary': selectedTab === 'movies' }"
            >
              Movies
            </span>
          </button>

          <button
            class="flex flex-col items-center gap-1 cursor-pointer"
            @click="setSelectedTab('series')"
          >
            <Icon
              name="lucide:monitor-play"
              class="w-6 h-6"
              :class="{ 'text-primary': selectedTab === 'series' }"
              aria-hidden="true"
            />
            <span
              class="text-xs"
              :class="{ 'text-primary': selectedTab === 'series' }"
            >
              Series
            </span>
          </button>
        </div>
      </div>
    </div>
    <div class="main w-full h-screen overflow-y-auto">
      <Header />
      <div class="main-content flex flex-col p-4">
        <div class="video-holder">
          <video ref="videoElement" controls crossorigin playsinline>
            <source
              v-if="sourceUrl"
              :src="sourceUrl"
              type="application/x-mpegURL"
            />
          </video>
        </div>
        <div class="items-holder w-full max-h-60vh overflow-y-auto">
          <div
            v-if="selectedTab === 'live-tv' && selectedCategory && getLiveItems"
            class="grid grid-cols-7 gap-4 max-h-400px overflow-y-auto"
          >
            <div v-for="item in getLiveItems" :key="item?.id || Math.random()">
              <UCard
                v-if="item"
                variant="subtle"
                class="text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-primary-700 rounded-md"
                :class="{
                  'bg-primary-100 dark:bg-primary-900': selectedItem === item,
                }"
                @click="setSelectedItem(item)"
              >
                <img
                  v-if="item.logo"
                  :src="item.logo"
                  alt="logo"
                  class="w-full h-full object-cover"
                />
                <template #footer>
                  <span>{{ item.name }}</span>
                </template>
              </UCard>
            </div>
          </div>
          <div
            v-if="
              selectedTab === 'movies' && selectedCategory && getMoviesItems
            "
            class="grid grid-cols-7 gap-4 max-h-400px overflow-y-auto"
          >
            <div
              v-for="item in getMoviesItems"
              :key="item?.id || Math.random()"
            >
              <UCard
                v-if="item"
                variant="subtle"
                class="text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-primary-700 rounded-md"
                :class="{
                  'bg-primary-100 dark:bg-primary-900': selectedItem === item,
                }"
                @click="setSelectedItem(item)"
              >
                <img
                  v-if="item.screenshot_uri"
                  :src="item.screenshot_uri"
                  alt="logo"
                  class="w-full h-full object-cover"
                />
                <template #footer>
                  <span>{{ item.name }}</span>
                </template>
              </UCard>
            </div>
          </div>
          <div
            v-if="
              selectedTab === 'series' && selectedCategory && getSeriesItems
            "
            class="grid grid-cols-7 gap-4 max-h-400px overflow-y-auto"
          >
            <div
              v-for="item in getSeriesItems"
              :key="item?.id || Math.random()"
            >
              <UCard
                v-if="item"
                variant="subtle"
                class="text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-primary-700 rounded-md"
                :class="{
                  'bg-primary-100 dark:bg-primary-900': selectedItem === item,
                }"
                @click="setSelectedItem(item)"
              >
                <img
                  v-if="item.screenshot_uri"
                  :src="item.screenshot_uri"
                  alt="logo"
                  class="w-full h-full object-cover"
                />
                <template #footer>
                  <span>{{ item.name }}</span>
                </template>
              </UCard>
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

const videoElement = ref<HTMLVideoElement | null>(null);
const playerContainer = ref<HTMLDivElement | null>(null);
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
};

// Initialize Plyr when component mounts
onMounted(async () => {
  if (process.client && videoElement.value) {
    try {
      const PlyrModule = await import("plyr");
      const Plyr = PlyrModule.default || PlyrModule;
      player = new Plyr(videoElement.value, options);

      player.on("error", (event) => {
        const errorCode = event.detail.plyr.code;
        console.error(`Playback error: ${errorCode}`);
      });
    } catch (error) {
      console.error("Failed to load Plyr:", error);
    }
  }
});

// Cleanup Plyr when component unmounts
onUnmounted(() => {
  if (player) {
    player.destroy();
    player = null;
  }
});

// Watch for sourceUrl changes and update Plyr
watch(
  () => stalker.sourceUrl,
  (newUrl) => {
    sourceUrl.value = newUrl;

    console.log(newUrl);

    if (player && videoElement.value && newUrl) {
      // Update the source
      const source = videoElement.value.querySelector("source");
      if (source) {
        source.src = newUrl;
      }
      // Reload the player with new source
      player.source = {
        type: "video",
        sources: [
          {
            src: newUrl,
            type: "application/x-mpegURL",
          },
        ],
      };

      player.play();
    }
  }
);

function setSelectedItem(item: any) {
  selectedItem.value = item;
  stalker.setSelectedItem(item);

  if (selectedTab.value === "live-tv") {
    stalker.createLink(item.cmd, "itv");
  }

  if (selectedTab.value === "movies") {
    stalker.createLink(item.cmd, "vod");
  }

  if (selectedTab.value === "series") {
    stalker.getSeriesSeasons(item.id);
  }
}

function setSelectedTab(tab: string) {
  selectedTab.value = tab;
  selectedCategory.value = null;
  selectedItem.value = null;
}

const getMoviesItems = computed(() => {
  if (!selectedCategory.value) return [];
  const key = `${selectedCategory.value.id}_1`;
  const items = stalker.moviesItems[key];
  if (!items || !Array.isArray(items)) {
    console.warn("Movies items not found or not an array:", key, items);
    return [];
  }
  return items;
});

const getSeriesItems = computed(() => {
  if (!selectedCategory.value) return [];
  const key = `${selectedCategory.value.id}_1`;
  const items = stalker.seriesItems[key];
  if (!items || !Array.isArray(items)) {
    console.warn("Series items not found or not an array:", key, items);
    return [];
  }
  return items;
});

function setSelectedCategory(category: any) {
  selectedCategory.value = category;
  selectedItem.value = null;
  if (selectedTab.value === "live-tv") {
    stalker.getLiveItems(category.id);
  } else if (selectedTab.value === "movies") {
    stalker.getMoviesItems(category.id);
  } else if (selectedTab.value === "series") {
    stalker.getSeriesItems(category.id);
  }
}
</script>

<style scoped>
.video-holder {
  display: grid;
  width: 100%;
  margin-bottom: 20px;
  min-height: 400px;
  max-height: 60vh;
}
.items-holder {
  display: grid;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 400px;
  overflow-y: auto;
  max-height: 40vh;
}
</style>
