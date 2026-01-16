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
        <div class="search-container w-full px-2 pt-2">
          <UInput
            v-model="search"
            placeholder="Search categories..."
            icon="i-lucide-search"
            size="sm"
            class="mb-2"
            clearable
          />
        </div>
        <div class="categories-list px-2">
          <!-- Live TV Categories -->
          <div v-if="selectedTab === 'live-tv'">
            <div
              v-for="category in filteredLiveCategories"
              :key="category.category_id || category.id"
              class="p-2 mb-2 text-sm rounded-md bg-gray-100 dark:bg-gray-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-primary-700 transition-colors"
              :class="{
                'bg-primary-200 dark:bg-primary-800 border-2 border-primary-500':
                  selectedCategory?.category_id === category.category_id ||
                  selectedCategory?.id === category.id,
              }"
              @click="setSelectedCategory(category)"
            >
              <span>{{ category.category_name || category.title }}</span>
            </div>
            <div
              v-if="filteredLiveCategories.length === 0 && search"
              class="text-center py-4 text-gray-400 text-sm"
            >
              <Icon
                name="i-lucide-search-x"
                class="w-8 h-8 mx-auto mb-2 opacity-50"
              />
              <p>No categories found</p>
            </div>
          </div>
          <!-- Movies Categories -->
          <div v-if="selectedTab === 'movies'">
            <div
              v-for="category in filteredMoviesCategories"
              :key="category.category_id || category.id"
              class="p-2 mb-2 text-sm rounded-md bg-gray-100 dark:bg-gray-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-primary-700 transition-colors"
              :class="{
                'bg-primary-200 dark:bg-primary-800 border-2 border-primary-500':
                  selectedCategory?.category_id === category.category_id ||
                  selectedCategory?.id === category.id,
              }"
              @click="setSelectedCategory(category)"
            >
              <span>{{ category.category_name || category.title }}</span>
            </div>
            <div
              v-if="filteredMoviesCategories.length === 0 && search"
              class="text-center py-4 text-gray-400 text-sm"
            >
              <Icon
                name="i-lucide-search-x"
                class="w-8 h-8 mx-auto mb-2 opacity-50"
              />
              <p>No categories found</p>
            </div>
          </div>
          <!-- Series Categories -->
          <div v-if="selectedTab === 'series'">
            <div
              v-for="category in filteredSeriesCategories"
              :key="category.category_id || category.id"
              class="p-2 mb-2 text-sm rounded-md bg-gray-100 dark:bg-gray-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-primary-700 transition-colors"
              :class="{
                'bg-primary-200 dark:bg-primary-800 border-2 border-primary-500':
                  selectedCategory?.category_id === category.category_id ||
                  selectedCategory?.id === category.id,
              }"
              @click="setSelectedCategory(category)"
            >
              <span>{{ category.category_name || category.title }}</span>
            </div>
            <div
              v-if="filteredSeriesCategories.length === 0 && search"
              class="text-center py-4 text-gray-400 text-sm"
            >
              <Icon
                name="i-lucide-search-x"
                class="w-8 h-8 mx-auto mb-2 opacity-50"
              />
              <p>No categories found</p>
            </div>
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
        <button
          class="flex flex-col items-center gap-1 cursor-pointer"
          @click="setSelectedTab('account')"
        >
          <Icon
            name="lucide:user"
            class="w-6 h-6"
            :class="{ 'text-primary': selectedTab === 'account' }"
            aria-hidden="true"
          />
          <span class="text-xs">Account</span>
        </button>
      </div>
    </div>
    <div class="maincontent w-full h-screen overflow-auto p-10">
      <UProgress v-if="progress > 0 && progress < 100" v-model="progress" />
      <div v-if="selectedTab == 'live-tv'">
        <Live />
      </div>
      <div v-if="selectedTab == 'movies'" @scroll="onScroll"><Movies /></div>
      <div v-if="selectedTab == 'series'">
        <Series />
      </div>
      <div v-if="selectedTab == 'account'">
        <div class="flex flex-col gap-4 max-w-md mx-auto">
          <h1 class="text-2xl text-center font-bold mb-4">Account Settings</h1>

          <div class="p-4 bg-gray-800 rounded-lg">
            <h2 class="text-lg font-semibold mb-2">Current Provider</h2>
            <p class="text-gray-400 capitalize">{{ providerType }}</p>
          </div>

          <UButton
            leadingIcon="i-lucide-log-out"
            size="xl"
            color="red"
            variant="solid"
            @click="handleLogout"
          >
            Sign Out
          </UButton>
        </div>
      </div>
      <UModal class="m-10" fullscreen v-model:open="modalOpen">
        <template #content>
          <div
            class="modal-container flex flex-row h-full w-full bg-gray-900 dark:bg-gray-950"
          >
            <!-- Main Video Area -->
            <VideoPlayer />

            <!-- Channels Sidebar (only for live TV) -->
            <ChannelsSidebar v-if="selectedTab === 'live-tv'" />

            <!-- Series Details Sidebar (only for series) -->
            <SeriesSidebar
              v-if="selectedTab === 'series'"
              :selected-tab="selectedTab"
            />

            <!-- Movie Details Sidebar (only for movies) -->
            <MovieSidebar
              v-if="selectedTab === 'movies'"
              :selected-tab="selectedTab"
            />
          </div>
        </template>
      </UModal>
    </div>
  </div>
</template>

<script setup lang="ts">
const stalker = useStalkerStore();
const xtream = useXtreamStore();
const toast = useToast();

const selectedTab = ref("live-tv");
const selectedCategory = ref<any>(null);
const search = ref("");

// Determine which provider is active
const providerType = computed(() => {
  if (stalker.token) return "stalker";
  if (xtream.isAuthenticated) return "xtream";
  return null;
});

// Unified progress
const progress = computed(() => {
  return providerType.value === "stalker" ? stalker.progress : xtream.progress;
});

// Unified modal state
const modalOpen = computed({
  get: () => {
    return providerType.value === "stalker"
      ? stalker.modalOpen
      : xtream.modalOpen;
  },
  set: (val) => {
    if (providerType.value === "stalker") {
      stalker.modalOpen = val;
    } else if (providerType.value === "xtream") {
      xtream.modalOpen = val;
    }
  },
});

onMounted(async () => {
  if (!stalker.token && !xtream.isAuthenticated) {
    navigateTo("/");
  }
});

// Computed properties for categories (unified)
const filteredLiveCategories = computed(() => {
  const categories =
    providerType.value === "stalker"
      ? stalker.liveCategories
      : xtream.liveCategories;

  if (!categories || !Array.isArray(categories)) return [];
  if (!search.value.trim()) return categories;

  const searchTerm = search.value.toLowerCase().trim();
  return categories.filter((category: any) =>
    (category.title || category.category_name || "")
      .toLowerCase()
      .includes(searchTerm)
  );
});

const filteredMoviesCategories = computed(() => {
  const categories =
    providerType.value === "stalker"
      ? stalker.moviesCategories
      : xtream.vodCategories;

  if (!categories || !Array.isArray(categories)) return [];
  if (!search.value.trim()) return categories;

  const searchTerm = search.value.toLowerCase().trim();
  return categories.filter((category: any) =>
    (category.title || category.category_name || "")
      .toLowerCase()
      .includes(searchTerm)
  );
});

const filteredSeriesCategories = computed(() => {
  const categories =
    providerType.value === "stalker"
      ? stalker.seriesCategories
      : xtream.seriesCategories;

  if (!categories || !Array.isArray(categories)) return [];
  if (!search.value.trim()) return categories;

  const searchTerm = search.value.toLowerCase().trim();
  return categories.filter((category: any) =>
    (category.title || category.category_name || "")
      .toLowerCase()
      .includes(searchTerm)
  );
});

function setSelectedTab(tab: string) {
  selectedTab.value = tab;
  selectedCategory.value = null;
  search.value = "";

  if (tab === "live-tv" && filteredLiveCategories.value.length > 0) {
    setSelectedCategory(filteredLiveCategories.value[1]);
  } else if (tab === "movies" && filteredMoviesCategories.value.length > 0) {
    setSelectedCategory(filteredMoviesCategories.value[1]);
  } else if (tab === "series" && filteredSeriesCategories.value.length > 0) {
    setSelectedCategory(filteredSeriesCategories.value[1]);
  }
}

async function setSelectedCategory(category: any) {
  selectedCategory.value = category;

  if (providerType.value === "stalker") {
    stalker.selectedCategory = category;
    const categoryId = category.id;

    if (selectedTab.value === "live-tv") {
      await stalker.getLiveItems(categoryId);
    } else if (selectedTab.value === "movies") {
      await stalker.getMoviesItems(categoryId);
    } else if (selectedTab.value === "series") {
      await stalker.getSeriesItems(categoryId);
    }
  } else if (providerType.value === "xtream") {
    xtream.selectedCategory = category;
    const categoryId = (category.category_id || category.id).toString();

    if (selectedTab.value === "live-tv") {
      await xtream.getLiveStreams(categoryId);
    } else if (selectedTab.value === "movies") {
      await xtream.getVodStreams(categoryId);
    } else if (selectedTab.value === "series") {
      await xtream.getSeriesStreams(categoryId);
    }
  }
}

function handleLogout() {
  if (providerType.value === "stalker") {
    stalker.$reset();
  } else if (providerType.value === "xtream") {
    xtream.logout();
  }

  toast.add({
    title: "Logged Out",
    description: "You have been successfully logged out",
    color: "green",
  });

  navigateTo("/");
}
</script>

<style scoped>
.modal-container {
  backdrop-filter: blur(10px);
}
</style>
