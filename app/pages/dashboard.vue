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

        <!-- Continue Watching Section (shown on Live/Movies/Series tabs) -->
        <div v-if="['live-tv', 'movies', 'series'].includes(selectedTab) && continueWatchingList.length > 0" class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold flex items-center gap-2">
              <UIcon name="i-lucide-play-circle" class="w-6 h-6 text-red-600" />
              Continue Watching
            </h2>
            <UButton
              icon="i-lucide-x"
              color="gray"
              variant="ghost"
              size="sm"
              @click="handleClearContinueWatching"
            >
              Clear All
            </UButton>
          </div>

          <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            <div
              v-for="item in continueWatchingList"
              :key="item.id"
              class="relative group"
            >
              <Card
                :item="item.data"
                :name="item.name"
                :image="item.image"
                :contentType="item.contentType"
                :providerType="item.providerType"
                @click="resumeWatchingItem(item)"
              />
              <!-- Progress Bar Overlay -->
              <div class="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                <div
                  class="h-full bg-red-600 transition-all"
                  :style="{ width: `${item.progress}%` }"
                ></div>
              </div>
              <!-- Remove Button -->
              <button
                @click.stop="watchHistoryStore.remove(item.id)"
                class="absolute top-2 left-2 p-1.5 rounded-full bg-black/80 hover:bg-red-600 backdrop-blur-sm transition-colors z-20 opacity-0 group-hover:opacity-100"
              >
                <UIcon name="i-lucide-x" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

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
          <div class="max-w-2xl mx-auto py-12">
            <h2 class="text-2xl font-bold mb-8">Account Settings</h2>

            <!-- Active Account -->
            <div v-if="accountsStore.activeAccount" class="bg-[#141414] p-6 rounded border border-green-600/50 mb-6">
              <div class="flex items-start justify-between mb-2">
                <div>
                  <span class="text-gray-500 text-sm">Active Account</span>
                  <p class="text-xl font-bold">{{ accountsStore.activeAccount.name }}</p>
                </div>
                <UBadge color="green" variant="soft">Active</UBadge>
              </div>
              <p class="text-sm text-gray-400 uppercase">{{ accountsStore.activeAccount.providerType }}</p>
            </div>

            <!-- Saved Accounts -->
            <div class="bg-[#141414] p-6 rounded border border-white/10 mb-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold">Saved Accounts</h3>
                <UButton
                  v-if="accountsStore.accounts.length < 10"
                  icon="i-lucide-plus"
                  color="primary"
                  variant="soft"
                  size="sm"
                  @click="showAddAccountModal = true"
                >
                  Add Account
                </UButton>
              </div>

              <div v-if="accountsStore.accounts.length === 0" class="text-center py-8 text-gray-500">
                <UIcon name="i-lucide-user-x" class="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No saved accounts</p>
              </div>

              <div v-else class="space-y-3">
                <div
                  v-for="account in accountsStore.all"
                  :key="account.id"
                  class="bg-black/50 p-4 rounded border border-white/5 hover:border-white/10 transition-all"
                >
                  <div class="flex items-start justify-between gap-4">
                    <div class="flex-1">
                      <div class="flex items-center gap-2 mb-1">
                        <h4 class="font-semibold">{{ account.name }}</h4>
                        <UBadge v-if="account.isActive" color="green" variant="soft" size="xs">Active</UBadge>
                      </div>
                      <p class="text-xs text-gray-400 uppercase mb-1">{{ account.providerType }}</p>
                      <p class="text-xs text-gray-500">Last used {{ formatRelativeTime(account.lastUsedAt) }}</p>
                    </div>

                    <div class="flex items-center gap-2">
                      <UButton
                        v-if="!account.isActive"
                        icon="i-lucide-arrow-right"
                        color="primary"
                        variant="soft"
                        size="xs"
                        @click="handleSwitchToAccount(account.id)"
                      >
                        Switch
                      </UButton>
                      <UButton
                        icon="i-lucide-pencil"
                        color="gray"
                        variant="ghost"
                        size="xs"
                        @click="handleEditAccount(account)"
                      />
                      <UButton
                        icon="i-lucide-trash-2"
                        color="error"
                        variant="ghost"
                        size="xs"
                        @click="handleDeleteAccount(account.id)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Category Management -->
            <div class="bg-[#141414] p-6 rounded border border-white/10 mb-6">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="text-lg font-semibold">Category Management</h3>
                  <p class="text-sm text-gray-400 mt-1">
                    Hide entire categories to filter them from all views
                  </p>
                </div>
                <UBadge v-if="channelMgmtStore.hiddenCategoriesCount > 0" color="gray">
                  {{ channelMgmtStore.hiddenCategoriesCount }} hidden
                </UBadge>
              </div>

              <!-- Category Type Tabs -->
              <div class="flex gap-2 mb-4 border-b border-white/10">
                <button
                  @click="activeCategoryTab = 'live'"
                  class="px-4 py-2 text-sm font-medium transition-all relative"
                  :class="activeCategoryTab === 'live'
                    ? 'text-red-500'
                    : 'text-gray-400 hover:text-white'"
                >
                  Live TV
                  <span v-if="liveTVCategories.length > 0" class="ml-1.5 text-xs opacity-60">
                    ({{ liveTVCategories.length }})
                  </span>
                  <div
                    v-if="activeCategoryTab === 'live'"
                    class="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"
                  ></div>
                </button>
                <button
                  @click="activeCategoryTab = 'movies'"
                  class="px-4 py-2 text-sm font-medium transition-all relative"
                  :class="activeCategoryTab === 'movies'
                    ? 'text-red-500'
                    : 'text-gray-400 hover:text-white'"
                >
                  Movies
                  <span v-if="movieCategories.length > 0" class="ml-1.5 text-xs opacity-60">
                    ({{ movieCategories.length }})
                  </span>
                  <div
                    v-if="activeCategoryTab === 'movies'"
                    class="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"
                  ></div>
                </button>
                <button
                  @click="activeCategoryTab = 'series'"
                  class="px-4 py-2 text-sm font-medium transition-all relative"
                  :class="activeCategoryTab === 'series'
                    ? 'text-red-500'
                    : 'text-gray-400 hover:text-white'"
                >
                  Series
                  <span v-if="seriesCategories.length > 0" class="ml-1.5 text-xs opacity-60">
                    ({{ seriesCategories.length }})
                  </span>
                  <div
                    v-if="activeCategoryTab === 'series'"
                    class="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"
                  ></div>
                </button>
              </div>

              <!-- Category List -->
              <div v-if="displayedCategories.length === 0" class="text-center py-8 text-gray-500">
                <UIcon name="i-lucide-folder-x" class="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No {{ activeCategoryTab === 'live' ? 'Live TV' : activeCategoryTab === 'movies' ? 'Movie' : 'Series' }} categories available</p>
              </div>

              <div v-else class="space-y-2 max-h-96 overflow-y-auto pr-2">
                <div
                  v-for="category in displayedCategories"
                  :key="category.id"
                  class="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded transition-colors"
                >
                  <div class="flex-1">
                    <p class="font-medium">{{ category.title || category.category_name }}</p>
                    <p v-if="category.channelCount" class="text-sm text-gray-500">
                      {{ category.channelCount }} items
                    </p>
                  </div>
                  <UButton
                    :icon="isCategoryHidden(category) ? 'i-lucide-eye' : 'i-lucide-eye-off'"
                    :color="isCategoryHidden(category) ? 'primary' : 'gray'"
                    :variant="isCategoryHidden(category) ? 'soft' : 'ghost'"
                    size="sm"
                    @click="toggleCategoryVisibility(category)"
                  >
                    {{ isCategoryHidden(category) ? 'Show' : 'Hide' }}
                  </UButton>
                </div>
              </div>

              <UButton
                v-if="channelMgmtStore.hiddenCategoriesCount > 0"
                @click="handleUnhideAllCategories()"
                variant="soft"
                color="primary"
                size="sm"
                class="mt-4"
              >
                Show All Categories
              </UButton>
            </div>

            <!-- Channel Management -->
            <div v-if="channelMgmtStore.hiddenCount > 0" class="bg-[#141414] p-6 rounded border border-white/10 mb-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold">Hidden Channels</h3>
                <UBadge color="gray">{{ channelMgmtStore.hiddenCount }}</UBadge>
              </div>
              <p class="text-sm text-gray-400 mb-4">
                Individual channels you've hidden. Click to unhide.
              </p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="channelId in channelMgmtStore.hiddenChannels"
                  :key="channelId"
                  @click="handleUnhideChannel(channelId)"
                  class="px-3 py-2 bg-white/5 hover:bg-white/10 rounded text-sm transition-colors flex items-center gap-2"
                >
                  <UIcon name="i-lucide-eye" class="w-4 h-4" />
                  <span>{{ getChannelNameById(channelId) }}</span>
                </button>
              </div>
              <UButton
                @click="channelMgmtStore.clearHidden()"
                variant="soft"
                color="primary"
                size="sm"
                class="mt-4"
              >
                Unhide All Channels
              </UButton>
            </div>

            <!-- Cache Statistics -->
            <div class="bg-[#141414] p-6 rounded border border-white/10 mb-6">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="text-lg font-semibold">Cache Statistics</h3>
                  <p class="text-sm text-gray-400 mt-1">
                    Monitor and manage cached data for faster performance
                  </p>
                </div>
                <UButton
                  @click="loadCacheStats"
                  icon="i-lucide-refresh-cw"
                  variant="ghost"
                  size="sm"
                  :loading="isLoadingStats"
                >
                  Refresh
                </UButton>
              </div>

              <!-- Stats Grid -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div class="bg-white/5 p-4 rounded">
                  <p class="text-2xl font-bold text-white">{{ cacheStats.totalKeys }}</p>
                  <p class="text-xs text-gray-400 mt-1">Cached Items</p>
                </div>
                <div class="bg-white/5 p-4 rounded">
                  <p class="text-2xl font-bold text-white">{{ cacheStats.totalSize }} KB</p>
                  <p class="text-xs text-gray-400 mt-1">Storage Used</p>
                </div>
                <div class="bg-white/5 p-4 rounded">
                  <p class="text-2xl font-bold" :class="cacheStats.expired > 0 ? 'text-yellow-500' : 'text-green-500'">
                    {{ cacheStats.expired }}
                  </p>
                  <p class="text-xs text-gray-400 mt-1">Expired Entries</p>
                </div>
                <div class="bg-white/5 p-4 rounded">
                  <p class="text-2xl font-bold text-white">{{ cacheHitRate }}%</p>
                  <p class="text-xs text-gray-400 mt-1">Cache Hit Rate</p>
                </div>
              </div>

              <!-- Cache Actions -->
              <div class="flex gap-3">
                <UButton
                  @click="handleRefreshCache"
                  icon="i-lucide-refresh-ccw"
                  variant="soft"
                  color="primary"
                  :loading="isRefreshingCache"
                >
                  Refresh All Cache
                </UButton>
                <UButton
                  @click="handleClearExpired"
                  icon="i-lucide-trash"
                  variant="soft"
                  color="gray"
                >
                  Clear Expired
                </UButton>
                <UButton
                  @click="handleClearCache"
                  icon="i-lucide-trash-2"
                  variant="outline"
                  color="error"
                >
                  Clear All Cache
                </UButton>
              </div>

              <!-- Cache Details (Expandable) -->
              <div v-if="showCacheDetails" class="mt-4 pt-4 border-t border-white/10">
                <h4 class="text-sm font-semibold mb-2 text-gray-300">Cached Categories</h4>
                <div class="space-y-2 max-h-48 overflow-y-auto">
                  <div
                    v-for="(age, key) in cacheAges"
                    :key="key"
                    class="flex items-center justify-between text-sm p-2 bg-white/5 rounded"
                  >
                    <span class="text-gray-300">{{ formatCacheKey(key) }}</span>
                    <span class="text-gray-500">{{ age }} min ago</span>
                  </div>
                </div>
              </div>

              <UButton
                @click="showCacheDetails = !showCacheDetails"
                variant="ghost"
                size="sm"
                class="mt-3 w-full"
              >
                {{ showCacheDetails ? 'Hide' : 'Show' }} Cache Details
                <UIcon :name="showCacheDetails ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" class="ml-1" />
              </UButton>
            </div>

            <!-- Playback Settings -->
            <div class="bg-[#141414] p-6 rounded border border-white/10 mb-6">
              <h3 class="text-lg font-semibold mb-4">Playback Settings</h3>
              <div class="flex items-center justify-between gap-4">
                <div class="flex-1">
                  <p class="font-medium">Auto-play next episode</p>
                  <p class="text-sm text-gray-500">Automatically play the next episode when one finishes</p>
                </div>
                <USwitch
                  v-model="settings.autoPlayNextEpisode"
                  @update:model-value="settings.save()"
                  size="lg"
                />
              </div>
            </div>

            <!-- Danger Zone -->
            <div class="bg-red-950/20 p-6 rounded border border-red-600/30">
              <h3 class="text-lg font-semibold mb-4 text-red-400">Danger Zone</h3>
              <div class="flex flex-col gap-3">
                <UButton
                  block
                  size="xl"
                  color="error"
                  variant="outline"
                  icon="i-lucide-log-out"
                  @click="handleLogout"
                >
                  Sign Out
                </UButton>
                <UButton
                  v-if="accountsStore.accounts.length > 0"
                  block
                  size="xl"
                  color="error"
                  variant="soft"
                  icon="i-lucide-trash-2"
                  @click="handleClearAllAccounts"
                >
                  Clear All Accounts
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  <!-- Add Account Modal -->
  <UModal v-model:open="showAddAccountModal" :close="true">
    <template #content>
      <div class="p-6 bg-[#141414]">
        <h3 class="text-xl font-bold mb-6">Add New Account</h3>

        <div class="space-y-4">
          <div>
            <label class="text-sm text-gray-400 mb-1 block">Account Name</label>
            <UInput
              v-model="newAccountForm.name"
              placeholder="e.g., Home IPTV"
              size="xl"
              block
            />
          </div>

          <div>
            <label class="text-sm text-gray-400 mb-1 block">Provider Type</label>
            <div class="grid grid-cols-2 gap-3">
              <button
                @click="newAccountForm.providerType = 'stalker'"
                class="p-4 rounded border-2 transition-all"
                :class="newAccountForm.providerType === 'stalker'
                  ? 'border-red-600 bg-red-600/10'
                  : 'border-white/10 hover:border-white/20'"
              >
                <p class="font-semibold">Stalker</p>
              </button>
              <button
                @click="newAccountForm.providerType = 'xtream'"
                class="p-4 rounded border-2 transition-all"
                :class="newAccountForm.providerType === 'xtream'
                  ? 'border-red-600 bg-red-600/10'
                  : 'border-white/10 hover:border-white/20'"
              >
                <p class="font-semibold">Xtream</p>
              </button>
            </div>
          </div>

          <!-- Stalker Fields -->
          <template v-if="newAccountForm.providerType === 'stalker'">
            <div>
              <label class="text-sm text-gray-400 mb-1 block">Portal URL</label>
              <UInput
                v-model="newAccountForm.portalUrl"
                placeholder="http://example.com/stalker_portal/c"
                size="xl"
                block
              />
            </div>
            <div>
              <label class="text-sm text-gray-400 mb-1 block">MAC Address</label>
              <UInput
                v-model="newAccountForm.macAddress"
                placeholder="00:1A:79:XX:XX:XX"
                size="xl"
                block
              />
            </div>
          </template>

          <!-- Xtream Fields -->
          <template v-if="newAccountForm.providerType === 'xtream'">
            <div>
              <label class="text-sm text-gray-400 mb-1 block">Server URL</label>
              <UInput
                v-model="newAccountForm.serverUrl"
                placeholder="http://example.com:8080"
                size="xl"
                block
              />
            </div>
            <div>
              <label class="text-sm text-gray-400 mb-1 block">Username</label>
              <UInput
                v-model="newAccountForm.username"
                placeholder="username"
                size="xl"
                block
              />
            </div>
            <div>
              <label class="text-sm text-gray-400 mb-1 block">Password</label>
              <UInput
                v-model="newAccountForm.password"
                type="password"
                placeholder="password"
                size="xl"
                block
              />
            </div>
          </template>
        </div>

        <div class="flex gap-3 mt-6">
          <UButton
            block
            size="xl"
            color="gray"
            variant="outline"
            @click="showAddAccountModal = false"
          >
            Cancel
          </UButton>
          <UButton
            block
            size="xl"
            color="primary"
            :loading="isAddingAccount"
            @click="handleAddAccount"
          >
            Add Account
          </UButton>
        </div>
      </div>
    </template>
  </UModal>

  <!-- Edit Account Modal -->
  <UModal v-model:open="showEditAccountModal" :close="true">
    <template #content>
      <div class="p-6 bg-[#141414]">
        <h3 class="text-xl font-bold mb-6">Edit Account</h3>

        <div class="space-y-4">
          <div>
            <label class="text-sm text-gray-400 mb-1 block">Account Name</label>
            <UInput
              v-model="editAccountForm.name"
              placeholder="e.g., Home IPTV"
              size="xl"
              block
            />
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <UButton
            block
            size="xl"
            color="gray"
            variant="outline"
            @click="showEditAccountModal = false"
          >
            Cancel
          </UButton>
          <UButton
            block
            size="xl"
            color="primary"
            @click="handleSaveAccountName"
          >
            Save
          </UButton>
        </div>
      </div>
    </template>
  </UModal>

  <!-- Search Modal -->
  <SearchModal v-model:open="showSearchModal" @select="handleSearchResult" />

  <!-- Memory Monitor -->
  <MemoryMonitor />

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

         <VideoPlayer v-if="modalOpen" :key="playerKey" class="flex-1" />

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

import { apiCache } from '~/utils/cache';

const stalker = useStalkerStore();
const xtream = useXtreamStore();
const settings = useSettingsStore();
const accountsStore = useAccountsStore();
const watchHistoryStore = useWatchHistoryStore();
const channelMgmtStore = useChannelManagementStore();
const toast = useToast();
const { setupCommonShortcuts } = useCommonShortcuts();
const { switchAccount } = useAuth();
const favorites = useFavorites();
const { startAutoCleanup, stopAutoCleanup } = useMemoryCleanup();

const selectedTab = ref("live-tv");
const selectedCategory = ref<any>(null);
const search = ref("");
const searchInputRef = ref<HTMLElement | null>(null);
const playerKey = ref(0); // Key to force VideoPlayer recreation

// Global search modal
const showSearchModal = ref(false);

// Account management
const showAddAccountModal = ref(false);
const showEditAccountModal = ref(false);
const isAddingAccount = ref(false);
const activeCategoryTab = ref<'live' | 'movies' | 'series'>('live');
const newAccountForm = ref({
  name: '',
  providerType: 'stalker' as 'stalker' | 'xtream',
  portalUrl: '',
  macAddress: '',
  serverUrl: '',
  username: '',
  password: '',
});
const editAccountForm = ref({
  id: '',
  name: '',
});

// Cache statistics
const showCacheDetails = ref(false);
const isLoadingStats = ref(false);
const isRefreshingCache = ref(false);
const cacheStats = ref({
  totalKeys: 0,
  totalSize: 0,
  expired: 0,
});
const cacheAges = ref<Record<string, number>>({});
const cacheHitRate = computed(() => {
  // Simple estimation - if we have cached items, assume 80% hit rate
  return cacheStats.value.totalKeys > 0 ? 80 : 0;
});

// Favorites
const favoritesList = computed(() => favorites.all.value);

// Watch History - Continue Watching
const continueWatchingList = computed(() => watchHistoryStore.continueWatching);

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

  // Initialize stores
  settings.init();
  await accountsStore.init();
  watchHistoryStore.init();
  channelMgmtStore.init();

  // Load cache statistics
  loadCacheStats();

  // Setup keyboard shortcuts
  setupCommonShortcuts({
    onSearch: () => {
      // Open global search modal with Ctrl+K / Cmd+K
      showSearchModal.value = true;
    },
    onEscape: () => {
      // Close search modal if open
      if (showSearchModal.value) {
        showSearchModal.value = false;
        return;
      }

      // Clear search
      search.value = "";

      // Close modal if open
      if (modalOpen.value) {
        modalOpen.value = false;
      }
    },
  });

  // Add Ctrl+K / Cmd+K shortcut for search
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      showSearchModal.value = true;
    }
  };
  window.addEventListener('keydown', handleKeyDown);

  // Start automatic memory cleanup
  startAutoCleanup();

  // Auto-select first live-tv category on mount
  if (filteredLiveCategories.value.length > 0) {
    await setSelectedCategory(filteredLiveCategories.value[0]);
  }
});

onUnmounted(() => {
  // Stop automatic memory cleanup
  stopAutoCleanup();

  // Remove keyboard listener
  window.removeEventListener('keydown', handleKeyDown);
});

// Watch for modal close and force cleanup
watch(modalOpen, (isOpen, wasOpen) => {
  if (wasOpen && !isOpen) {
    // Modal was closed
    console.log('[Dashboard] Modal closed - forcing video cleanup');

    // Abort any pending playback requests
    if (providerType.value === "stalker") {
      if (stalker.playbackAbortController) {
        stalker.playbackAbortController.abort();
        stalker.playbackAbortController = null;
      }
      if (stalker.seriesInfoAbortController) {
        stalker.seriesInfoAbortController.abort();
        stalker.seriesInfoAbortController = null;
      }
      stalker.sourceUrl = null;
      stalker.currentChannel = null;
      stalker.currentMovie = null;
      stalker.currentSeries = null;
      stalker.currentEpisode = null;
    } else if (providerType.value === "xtream") {
      xtream.sourceUrl = null;
      xtream.currentStream = null;
      xtream.currentEpisode = null;
    }

    // Increment key to force VideoPlayer recreation on next open
    playerKey.value++;

    // Find and stop any video/audio elements that might be playing
    setTimeout(() => {
      const videos = document.querySelectorAll('video, audio');
      videos.forEach((media) => {
        if (!media.paused) {
          console.log('[Dashboard] Stopping orphaned media element');
          media.pause();
          media.src = '';
          media.load();
        }
      });
    }, 100);
  }
});

// Computed properties for categories (unified)
const filteredLiveCategories = computed(() => {
  const categories =
    providerType.value === "stalker"
      ? stalker.liveCategories
      : xtream.liveCategories;

  if (!categories || !Array.isArray(categories)) return [];

  // Filter out hidden categories
  let filtered = categories.filter((category: any) => {
    const categoryId = channelMgmtStore.generateCategoryIdFromCategory(category, providerType.value);
    return !channelMgmtStore.isCategoryHidden(categoryId);
  });

  // Apply search filter
  if (search.value.trim()) {
    const searchTerm = search.value.toLowerCase().trim();
    filtered = filtered.filter((category: any) =>
      (category.title || category.category_name || "")
        .toLowerCase()
        .includes(searchTerm)
    );
  }

  return filtered;
});

const filteredMoviesCategories = computed(() => {
  const categories =
    providerType.value === "stalker"
      ? stalker.moviesCategories
      : xtream.vodCategories;

  if (!categories || !Array.isArray(categories)) return [];

  // Filter out hidden categories
  let filtered = categories.filter((category: any) => {
    const categoryId = channelMgmtStore.generateCategoryIdFromCategory(category, providerType.value);
    return !channelMgmtStore.isCategoryHidden(categoryId);
  });

  // Apply search filter
  if (search.value.trim()) {
    const searchTerm = search.value.toLowerCase().trim();
    filtered = filtered.filter((category: any) =>
      (category.title || category.category_name || "")
        .toLowerCase()
        .includes(searchTerm)
    );
  }

  return filtered;
});

const filteredSeriesCategories = computed(() => {
  const categories =
    providerType.value === "stalker"
      ? stalker.seriesCategories
      : xtream.seriesCategories;

  if (!categories || !Array.isArray(categories)) return [];

  // Filter out hidden categories
  let filtered = categories.filter((category: any) => {
    const categoryId = channelMgmtStore.generateCategoryIdFromCategory(category, providerType.value);
    return !channelMgmtStore.isCategoryHidden(categoryId);
  });

  // Apply search filter
  if (search.value.trim()) {
    const searchTerm = search.value.toLowerCase().trim();
    filtered = filtered.filter((category: any) =>
      (category.title || category.category_name || "")
        .toLowerCase()
        .includes(searchTerm)
    );
  }

  return filtered;
});

function setSelectedTab(tab: string) {
  // Abort all pending requests when switching tabs
  if (providerType.value === "stalker") {
    stalker.abortAllRequests();
  } else if (providerType.value === "xtream") {
    // TODO: Add xtream abort method if needed
  }

  selectedTab.value = tab;
  selectedCategory.value = null;
  search.value = "";

  if (tab === "live-tv" && filteredLiveCategories.value.length > 0) {
    setSelectedCategory(filteredLiveCategories.value[0]);
  } else if (tab === "movies" && filteredMoviesCategories.value.length > 0) {
    setSelectedCategory(filteredMoviesCategories.value[0]);
  } else if (tab === "series" && filteredSeriesCategories.value.length > 0) {
    setSelectedCategory(filteredSeriesCategories.value[0]);
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

// Account management functions
async function handleAddAccount() {
  try {
    isAddingAccount.value = true;

    // Validate form
    if (!newAccountForm.value.name.trim()) {
      toast.add({
        title: 'Validation Error',
        description: 'Please enter an account name',
        color: 'error',
      });
      return;
    }

    // Prepare credentials
    let credentials: any = null;

    if (newAccountForm.value.providerType === 'stalker') {
      if (!newAccountForm.value.portalUrl || !newAccountForm.value.macAddress) {
        toast.add({
          title: 'Validation Error',
          description: 'Please enter Portal URL and MAC Address',
          color: 'error',
        });
        return;
      }
      credentials = {
        portalUrl: newAccountForm.value.portalUrl,
        macAddress: newAccountForm.value.macAddress,
      };
    } else if (newAccountForm.value.providerType === 'xtream') {
      if (!newAccountForm.value.serverUrl || !newAccountForm.value.username || !newAccountForm.value.password) {
        toast.add({
          title: 'Validation Error',
          description: 'Please enter Server URL, Username, and Password',
          color: 'error',
        });
        return;
      }
      credentials = {
        serverUrl: newAccountForm.value.serverUrl,
        username: newAccountForm.value.username,
        password: newAccountForm.value.password,
      };
    }

    // Add account
    const result = await accountsStore.addAccount(
      newAccountForm.value.name,
      newAccountForm.value.providerType,
      credentials
    );

    if (result.success) {
      toast.add({
        title: 'Account Added',
        description: `Successfully added ${newAccountForm.value.name}`,
        color: 'success',
      });

      // Reset form
      newAccountForm.value = {
        name: '',
        providerType: 'stalker',
        portalUrl: '',
        macAddress: '',
        serverUrl: '',
        username: '',
        password: '',
      };

      showAddAccountModal.value = false;
    } else {
      toast.add({
        title: 'Failed to Add Account',
        description: result.error || 'Unknown error occurred',
        color: 'error',
      });
    }
  } catch (error: any) {
    console.error('Failed to add account:', error);
    toast.add({
      title: 'Error',
      description: error.message || 'Failed to add account',
      color: 'error',
    });
  } finally {
    isAddingAccount.value = false;
  }
}

async function handleSwitchToAccount(accountId: string) {
  const success = await switchAccount(accountId);
  if (success) {
    // Reload the page data
    selectedTab.value = 'live-tv';
    if (filteredLiveCategories.value.length > 0) {
      await setSelectedCategory(filteredLiveCategories.value[0]);
    }
  }
}

function handleEditAccount(account: any) {
  editAccountForm.value = {
    id: account.id,
    name: account.name,
  };
  showEditAccountModal.value = true;
}

async function handleSaveAccountName() {
  const result = await accountsStore.updateAccountName(
    editAccountForm.value.id,
    editAccountForm.value.name
  );

  if (result.success) {
    toast.add({
      title: 'Account Updated',
      description: 'Account name updated successfully',
      color: 'success',
    });
    showEditAccountModal.value = false;
  } else {
    toast.add({
      title: 'Update Failed',
      description: result.error || 'Failed to update account name',
      color: 'error',
    });
  }
}

async function handleDeleteAccount(accountId: string) {
  const account = accountsStore.accounts.find(acc => acc.id === accountId);
  if (!account) return;

  if (confirm(`Are you sure you want to delete "${account.name}"?`)) {
    const success = await accountsStore.removeAccount(accountId);

    if (success) {
      toast.add({
        title: 'Account Deleted',
        description: `Successfully deleted ${account.name}`,
        color: 'success',
      });

      // If deleted active account, logout
      if (account.isActive) {
        handleLogout();
      }
    } else {
      toast.add({
        title: 'Delete Failed',
        description: 'Failed to delete account',
        color: 'error',
      });
    }
  }
}

async function handleClearAllAccounts() {
  if (confirm('Are you sure you want to clear ALL saved accounts? This cannot be undone.')) {
    await accountsStore.clearAll();

    toast.add({
      title: 'All Accounts Cleared',
      description: 'All saved accounts have been removed',
      color: 'success',
    });

    // Logout and redirect to login
    handleLogout();
  }
}

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

// Channel management functions
function getChannelNameById(channelId: string): string {
  // Extract the ID part (remove provider prefix)
  const parts = channelId.split('_');
  const id = parts[parts.length - 1];
  return `Channel ${id}`;
}

function handleUnhideChannel(channelId: string) {
  channelMgmtStore.unhideChannel(channelId);
  toast.add({
    title: 'Channel Unhidden',
    description: 'Channel is now visible in the channel list',
    color: 'success',
    timeout: 2000,
  });
}

// Category management - separated by type
const liveTVCategories = computed(() => {
  const categories = providerType.value === 'stalker'
    ? stalker.liveCategories || []
    : xtream.liveCategories || [];

  return categories.map((cat: any) => ({
    ...cat,
    id: cat.category_id || cat.id,
  }));
});

const movieCategories = computed(() => {
  const categories = providerType.value === 'stalker'
    ? stalker.moviesCategories || []
    : xtream.vodCategories || [];

  return categories.map((cat: any) => ({
    ...cat,
    id: cat.category_id || cat.id,
  }));
});

const seriesCategories = computed(() => {
  const categories = providerType.value === 'stalker'
    ? stalker.seriesCategories || []
    : xtream.seriesCategories || [];

  return categories.map((cat: any) => ({
    ...cat,
    id: cat.category_id || cat.id,
  }));
});

const displayedCategories = computed(() => {
  if (activeCategoryTab.value === 'live') return liveTVCategories.value;
  if (activeCategoryTab.value === 'movies') return movieCategories.value;
  if (activeCategoryTab.value === 'series') return seriesCategories.value;
  return [];
});

function isCategoryHidden(category: any): boolean {
  const categoryId = channelMgmtStore.generateCategoryIdFromCategory(category, providerType.value);
  return channelMgmtStore.isCategoryHidden(categoryId);
}

function toggleCategoryVisibility(category: any) {
  const categoryId = channelMgmtStore.generateCategoryIdFromCategory(category, providerType.value);
  const isHidden = channelMgmtStore.isCategoryHidden(categoryId);
  const categoryName = category.title || category.category_name;

  if (isHidden) {
    channelMgmtStore.unhideCategory(categoryId);
    toast.add({
      title: 'Category Shown',
      description: `"${categoryName}" is now visible`,
      color: 'success',
      timeout: 2000,
    });
  } else {
    channelMgmtStore.hideCategory(categoryId);
    toast.add({
      title: 'Category Hidden',
      description: `"${categoryName}" has been hidden`,
      color: 'primary',
      timeout: 2000,
    });
  }
}

function handleUnhideAllCategories() {
  if (confirm('Show all hidden categories?')) {
    channelMgmtStore.clearHiddenCategories();
    toast.add({
      title: 'All Categories Shown',
      description: 'All categories are now visible',
      color: 'success',
      timeout: 2000,
    });
  }
}

// Cache management functions
function loadCacheStats() {
  isLoadingStats.value = true;

  try {
    // Get cache stats from utility
    cacheStats.value = apiCache.getStats();

    // Get ages for individual cache entries
    cacheAges.value = {};
    const keys = ['categories_live', 'categories_movies', 'categories_series'];

    keys.forEach(key => {
      const age = apiCache.getAge(key);
      if (age !== null) {
        cacheAges.value[key] = age;
      }
    });

    console.log('[Cache] Stats loaded:', cacheStats.value);
  } catch (error) {
    console.error('[Cache] Failed to load stats:', error);
  } finally {
    isLoadingStats.value = false;
  }
}

async function handleRefreshCache() {
  if (!confirm('Refresh all cached data? This will reload categories from the server.')) {
    return;
  }

  isRefreshingCache.value = true;

  try {
    if (providerType.value === 'stalker') {
      await stalker.refreshCache();
    } else if (providerType.value === 'xtream') {
      await xtream.refreshCache();
    }

    toast.add({
      title: 'Cache Refreshed',
      description: 'All data has been reloaded from the server',
      color: 'success',
    });

    // Reload stats
    loadCacheStats();
  } catch (error) {
    console.error('[Cache] Failed to refresh:', error);
    toast.add({
      title: 'Refresh Failed',
      description: 'Failed to refresh cache',
      color: 'error',
    });
  } finally {
    isRefreshingCache.value = false;
  }
}

function handleClearExpired() {
  const count = apiCache.clearExpired();

  toast.add({
    title: 'Expired Cache Cleared',
    description: `Removed ${count} expired cache entries`,
    color: 'success',
  });

  // Reload stats
  loadCacheStats();
}

function handleClearCache() {
  if (!confirm('Clear all cached data? You will need to reload categories from the server.')) {
    return;
  }

  if (providerType.value === 'stalker') {
    stalker.clearCache();
  } else if (providerType.value === 'xtream') {
    xtream.clearAllCache();
  }

  toast.add({
    title: 'Cache Cleared',
    description: 'All cached data has been removed',
    color: 'success',
  });

  // Reload stats
  loadCacheStats();
}

function formatCacheKey(key: string): string {
  return key
    .replace('categories_', '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

function handleClearContinueWatching() {
  if (confirm('Clear all continue watching items?')) {
    watchHistoryStore.clearContinueWatching();
    toast.add({
      title: 'Continue Watching Cleared',
      description: 'All in-progress items have been removed',
      color: 'success',
    });
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

async function resumeWatchingItem(item: any) {
  // Same logic as playFavoriteItem - resume will happen automatically in VideoPlayer
  await playFavoriteItem(item);
}

// Handle search result selection
async function handleSearchResult(result: any) {
  // Switch to appropriate tab
  if (result.type === 'live') {
    selectedTab.value = 'live-tv';
  } else if (result.type === 'movies') {
    selectedTab.value = 'movies';
  } else if (result.type === 'series') {
    selectedTab.value = 'series';
  }

  await nextTick();

  // Play the item
  if (result.data) {
    if (providerType.value === 'stalker') {
      if (result.type === 'live') {
        stalker.currentChannel = result.data;
        await stalker.createLink(result.data.cmd, 'itv');
        stalker.modalOpen = true;
      } else if (result.type === 'movies') {
        stalker.currentMovie = result.data;
        await stalker.createLink(result.data.cmd, 'vod');
        stalker.modalOpen = true;
      } else if (result.type === 'series') {
        stalker.currentSeries = result.data;
        stalker.modalOpen = true;
      }
    } else if (providerType.value === 'xtream') {
      if (result.type === 'live') {
        await xtream.playLiveStream(result.data);
      } else if (result.type === 'movies') {
        await xtream.playVodStream(result.data);
      } else if (result.type === 'series') {
        xtream.currentStream = result.data;
        xtream.modalOpen = true;
      }
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
