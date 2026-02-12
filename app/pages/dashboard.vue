<template>
  <div class="dashboard-wrapper min-h-screen bg-black overflow-hidden relative">
    <div class="flex flex-row h-screen text-white">
      <!-- Sidebar -->
      <div class="sidebar w-[250px] flex flex-col h-full bg-[#141414] border-r border-white/10">
        <div class="sidebar-header p-6 flex justify-center">
          <h1 class="text-2xl font-black text-red-600 tracking-tighter uppercase">Streamflix</h1>
        </div>

        <div class="flex-1 overflow-y-auto no-scrollbar px-2 pt-4">
          <UInput
            v-model="search"
            icon="i-lucide-search"
            variant="subtle"
            placeholder="Search Categories"
            block
            class="transition-all"
            :ui="{ 
              base: 'bg-[#333] border-transparent focus:border-red-600',
              leadingIcon: 'text-gray-500'
            }"
          />

          <div class="space-y-0.5">
            <!-- Categories List -->
            <template v-if="['live-tv', 'movies', 'series'].includes(selectedTab)">
              <button
                v-for="category in (selectedTab === 'live-tv' ? filteredLiveCategories : selectedTab === 'movies' ? filteredMoviesCategories : filteredSeriesCategories)"
                :key="category.category_id || category.id"
                @click="setSelectedCategory(category)"
                class="w-full text-left p-2.5 text-sm transition-all flex items-center gap-3 border-l-4"
                :class="[
                  (selectedCategory?.category_id === category.category_id || selectedCategory?.id === category.id)
                    ? 'bg-white/5 border-red-600 text-white font-bold'
                    : 'border-transparent text-gray-500 hover:text-white hover:bg-white/5'
                ]"
              >
                 <span class="truncate">{{ category.category_name || category.title }}</span>
              </button>
            </template>
          </div>
        </div>

        <!-- Bottom Nav -->
        <div class="p-4 bg-black/50 grid grid-cols-5 gap-1">
          <button 
            v-for="tab in [
              { id: 'live-tv', icon: 'i-lucide-tv' },
              { id: 'movies', icon: 'i-lucide-film' },
              { id: 'series', icon: 'i-lucide-monitor-play' },
              { id: 'favorites', icon: 'i-lucide-heart' },
              { id: 'account', icon: 'i-lucide-user' }
            ]"
            :key="tab.id"
            @click="setSelectedTab(tab.id)"
            class="flex flex-col items-center justify-center p-2 rounded transition-all"
            :class="selectedTab === tab.id ? 'text-red-600' : 'text-gray-500 hover:text-white'"
          >
            <UIcon :name="tab.icon" class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 h-screen overflow-y-auto bg-black relative p-8">
        <UProgress v-if="progress > 0 && progress < 100" v-model="progress" color="error" class="mb-4" />
        
        <!-- Content Views -->
        <div v-show="selectedTab === 'live-tv'"><Live /></div>
        <div v-show="selectedTab === 'movies'"><Movies /></div>
        <div v-show="selectedTab === 'series'"><Series /></div>
        
        <!-- Favorites -->
        <div v-if="selectedTab === 'favorites'">
          <div class="mb-8 flex items-center justify-between">
            <h2 class="text-3xl font-bold">My Favorites</h2>
            <UButton v-if="favoritesList.length > 0" icon="i-lucide-trash-2" color="error" variant="soft" @click="handleClearFavorites">Clear All</UButton>
          </div>

          <EmptyState v-if="favoritesList.length === 0" icon="i-lucide-heart" title="No Favorites Yet" />

          <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            <Card 
              v-for="fav in favoritesList" 
              :key="fav.id"
              :item="fav.data"
              :name="fav.name"
              :image="fav.image"
              :contentType="fav.contentType"
              :providerType="fav.providerType"
              @click="playFavoriteItem(fav)"
            />
          </div>
        </div>

        <!-- Account -->
        <div v-if="selectedTab === 'account'">
          <div class="max-w-md mx-auto py-12">
            <h2 class="text-2xl font-bold mb-8">Account Settings</h2>
            <div class="bg-[#141414] p-6 rounded border border-white/10 mb-6">
              <span class="text-gray-500 text-sm">Active Provider</span>
              <p class="text-xl font-bold uppercase">{{ providerType }}</p>
            </div>
            <UButton block size="xl" color="error" icon="i-lucide-log-out" @click="handleLogout">Sign Out</UButton>
          </div>
        </div>
      </div>
    </div>

  <!-- Player Modal (Fullscreen overlay) -->
  <UModal v-model:open="modalOpen" fullscreen :close="false">
    <template #content>
      <div class="w-full h-full bg-black flex overflow-hidden relative">
        <!-- Player Exit Button (Moved to top-left to avoid sidebar conflict) -->
        <UButton 
          @click="modalOpen = false"
          icon="i-lucide-x"
          size="xl"
          color="error"
          variant="solid" 
          class="absolute top-8 left-8 z-[10000] rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all"
        />

         <VideoPlayer class="flex-1" />
         
         <!-- Sidebars Wrapper (Ensuring clear width and top-level interaction) -->
         <div class="h-full shrink-0 relative z-[200] border-l border-white/10" :class="selectedTab === 'live-tv' ? 'w-80' : 'w-96'">
           <ChannelsSidebar v-if="selectedTab === 'live-tv'" class="w-full h-full" />
           <SeriesSidebar v-if="selectedTab === 'series'" :selected-tab="selectedTab" class="w-full h-full" />
           <MovieSidebar v-if="selectedTab === 'movies'" :selected-tab="selectedTab" class="w-full h-full" />
         </div>
      </div>
    </template>
  </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});

const stalker = useStalkerStore();
const xtream = useXtreamStore();
const toast = useToast();
const { setupCommonShortcuts } = useCommonShortcuts();
const favorites = useFavorites();

const selectedTab = ref("live-tv");
const selectedCategory = ref<any>(null);
const search = ref("");
const searchInputRef = ref<HTMLElement | null>(null);

// Favorites
const favoritesList = computed(() => favorites.all.value);

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

  // Setup keyboard shortcuts
  setupCommonShortcuts({
    onSearch: () => {
      // Focus search input
      const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    },
    onEscape: () => {
      // Clear search
      search.value = "";
      
      // Close modal if open
      if (modalOpen.value) {
        modalOpen.value = false;
      }
    },
  });
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
    color: "success",
  });

  navigateTo("/");
}

function handleClearFavorites() {
  if (confirm('Are you sure you want to clear all favorites?')) {
    favorites.clear();
  }
}

async function playFavoriteItem(fav: any) {
  // Switch to the appropriate tab
  if (fav.contentType === 'live') {
    selectedTab.value = 'live-tv';
  } else if (fav.contentType === 'movies') {
    selectedTab.value = 'movies';
  } else if (fav.contentType === 'series') {
    selectedTab.value = 'series';
  }

  // Wait for next tick to ensure tab is switched
  await nextTick();

  // Play the item based on provider
  if (fav.providerType === 'stalker') {
    if (fav.contentType === 'live') {
      stalker.currentChannel = fav.data;
      await stalker.createLink(fav.data.cmd, 'itv');
      stalker.modalOpen = true;
    } else if (fav.contentType === 'movies') {
      stalker.currentMovie = fav.data;
      await stalker.createLink(fav.data.cmd, 'vod');
      stalker.modalOpen = true;
    }
  } else if (fav.providerType === 'xtream') {
    if (fav.contentType === 'live') {
      await xtream.playLiveStream(fav.data);
    } else if (fav.contentType === 'movies') {
      await xtream.playVodStream(fav.data);
    }
  }
}

function onScroll(event: Event) {
  // Infinite scroll logic can be added here if needed
  const target = event.target as HTMLElement;
  if (target.scrollTop + target.clientHeight >= target.scrollHeight - 100) {
    // Load more items
  }
}
</script>

<style scoped>
.modal-container {
  backdrop-filter: blur(10px);
}
</style>
