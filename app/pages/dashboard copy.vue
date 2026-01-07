<template>
  <div class="flex flex-row h-screen">
    <div
      class="sidebar gap-4 border-r border-gray-500 border-solid w-[20%] flex flex-col h-full"
    >
      <div
        class="sidebar-header mt-3 flex items-center align-middle justify-center"
      >
        <h1
          class="text-2xl text-center font-bold text-white-800 text-shadow-black text-shadow-2xs"
        >
          STREAMFLIX
        </h1>
      </div>
      <div class="sidecats h-full overflow-auto">
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
      <div class="sidenav mb-2 flex flex-row w-full justify-around">
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
    <div class="maincontent w-full h-screen overflow-auto p-10">
      <UProgress
        v-if="stalker.progress > 0 && stalker.progress < 100"
        v-model="stalker.progress"
      />
      <div v-if="selectedTab == 'live-tv'">
        <Live />
      </div>
      <div v-if="selectedTab == 'movies'">
        <Movies />
      </div>
      <div v-if="selectedTab == 'series'">
        <Series />
      </div>
      <UModal class="m-10" fullscreen v-model:open="stalker.modalOpen">
        <template #content>
          <div
            class="plyrcontent flex flex-col justify-center items-center w-full h-full"
          >
            <div class="video-holder m-auto p-10 w-full h-full">
              <video
                ref="videoElement"
                controls
                crossorigin
                playsinline
                autoplay
                class="w-full h-full"
              >
                <source
                  v-if="sourceUrl"
                  :src="sourceUrl"
                  type="application/x-mpegURL"
                />
              </video>
            </div>
          </div>
        </template>
      </UModal>
    </div>
  </div>
</template>

<script setup lang="ts">
const stalker = useStalkerStore();
const selectedTab = ref("live-tv");
const selectedCategory = ref<any>(null);
const selectedItem = ref<any>(null);
const sourceUrl = ref<any>(null);
const progress = ref(0);
const videoElement = ref<HTMLVideoElement | null>(null);
const playerContainer = ref<HTMLDivElement | null>(null);
const modalOpen = ref(false);
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
  // grab the first set off items for live categories

  if (!stalker.token) {
    //  await stalker.setSelectedCategory(stalker.liveCategories[1]);
    navigateTo("/");
  }

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

    if (player && newUrl) {
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

      if (!stalker.modalOpen) {
        stalker.modalOpen = true;
      }
    }
  }
);

function setSelectedTab(tab: string) {
  selectedTab.value = tab;
  selectedCategory.value = null;
  selectedItem.value = null;

  if (tab === "live-tv") {
    stalker.getLiveItems(stalker.liveCategories[1].id);
    stalker.selectedCategory = stalker.liveCategories[1];
  } else if (tab === "movies") {
    stalker.getMoviesItems(stalker.moviesCategories[1].id);
    stalker.selectedCategory = stalker.moviesCategories[1];
  } else if (tab === "series") {
    stalker.getSeriesItems(stalker.seriesCategories[1].id);
    stalker.selectedCategory = stalker.seriesCategories[1];
  }
}

// Computed properties to safely access items
const getLiveItems = computed(() => {
  if (!selectedCategory.value) return [];
  const key = `${selectedCategory.value.id}_1`;
  const items = stalker.liveItems[key];
  if (!items || !Array.isArray(items)) {
    console.warn("Live items not found or not an array:", key, items);
    return [];
  }
  return items;
});

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
  selectedItem.value = category.value;
  stalker.selectedCategory = category;

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
