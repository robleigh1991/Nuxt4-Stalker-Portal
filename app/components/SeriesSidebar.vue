<template>
  <div
    v-if="stalker.currentSeries"
    class="series-sidebar w-96 bg-gray-800/95 dark:bg-gray-900/95 border-l border-gray-700 flex flex-col overflow-hidden"
  >
    <!-- Series Header with Background -->
    <div
      v-if="seriesDetails"
      class="series-header relative h-64 overflow-hidden"
    >
      <img
        v-if="seriesDetails.backdrop_path"
        :src="seriesDetails.backdrop_path"
        :alt="seriesDetails.name"
        onerror="this.onerror=null; this.src='https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"
      ></div>
      <div class="relative z-10 p-4 h-full flex flex-col justify-end">
        <h2 class="text-2xl font-bold text-white mb-2">
          {{ seriesDetails.name }}
        </h2>
        <div class="flex items-center gap-3 text-sm text-gray-300">
          <span v-if="seriesDetails.first_air_date">
            {{ new Date(seriesDetails.first_air_date).getFullYear() }}
            {{
              seriesDetails.last_air_date
                ? `- ${new Date(seriesDetails.last_air_date).getFullYear()}`
                : ""
            }}
          </span>
          <span v-if="seriesDetails.number_of_seasons">
            {{ seriesDetails.number_of_seasons }}
            {{ seriesDetails.number_of_seasons === 1 ? "Season" : "Seasons" }}
          </span>
          <div class="flex items-center gap-1">
            <Icon name="i-lucide-star" class="w-4 h-4 text-yellow-400" />
            <span v-if="seriesDetails.vote_average !== null">{{
              seriesDetails.vote_average
            }}</span>
          </div>
        </div>
      </div>
      <UButton
        icon="i-lucide-x"
        color="gray"
        variant="ghost"
        size="sm"
        class="absolute top-2 right-2 z-20"
        @click="stalker.modalOpen = false"
      />
    </div>

    <!-- Series Content -->
    <div class="series-content flex-1 overflow-y-auto p-4">
      <!-- Loading State -->
      <div v-if="loadingSeriesDetails" class="text-center py-8">
        <Icon
          name="i-lucide-loader-2"
          class="w-8 h-8 mx-auto mb-2 animate-spin text-primary-400"
        />
        <p class="text-gray-400">Loading series details...</p>
      </div>

      <!-- Series Details -->
      <div v-else-if="seriesDetails">
        <!-- Overview -->
        <div class="mb-4">
          <h3 class="text-lg font-semibold text-white mb-2">Overview</h3>
          <p class="text-sm text-gray-300 leading-relaxed">
            {{ seriesDetails.overview }}
          </p>
        </div>

        <!-- Genres -->
        <div v-if="seriesDetails.genres?.length" class="mb-4">
          <h3 class="text-lg font-semibold text-white mb-2">Genres</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="genre in seriesDetails.genres"
              :key="genre.id"
              class="px-2 py-1 text-xs rounded-full bg-primary-600/30 text-primary-200"
            >
              {{ genre.name }}
            </span>
          </div>
        </div>
        <!-- Season Selector -->
        <div v-if="availableSeasons.length > 0" class="mb-4">
          <h3 class="text-lg font-semibold text-white mb-2">Select Season</h3>
          <USelectMenu
            v-model="selectedSeason"
            :items="seasonItems"
            value-key="value"
            label-key="label"
            placeholder="Choose a season..."
            class="w-full"
          />
        </div>
        <!-- Episodes List -->
        <div v-if="selectedSeason && episodes.length > 0" class="mb-4">
          <h3 class="text-lg font-semibold text-white mb-2">Episodes</h3>
          <div class="space-y-2">
            <div
              v-for="episode in episodes"
              :key="episode.id || episode.episode_id"
              class="episode-item p-3 rounded-lg cursor-pointer transition-all duration-200 bg-gray-700/30 hover:bg-gray-700/50 border border-transparent hover:border-primary-500"
              @click="playEpisode(episode)"
            >
              <div class="flex items-start gap-3">
                <div
                  v-if="episode.screenshot_uri"
                  class="w-20 h-12 rounded overflow-hidden bg-gray-600 shrink-0"
                >
                  <img
                    :src="episode.screenshot_uri"
                    :alt="episode.name"
                    class="w-full h-full object-cover"
                    onerror="this.onerror=null; this.src='https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-xs font-semibold text-primary-400">
                      E{{ episode.episode_num || episode.episode }}
                    </span>
                    <h4 class="text-sm font-semibold text-white truncate">
                      {{ episode.name }}
                    </h4>
                  </div>
                  <p
                    v-if="episode.description"
                    class="text-xs text-gray-400 line-clamp-2"
                  >
                    {{ episode.description }}
                  </p>
                  <p v-if="episode.air_date" class="text-xs text-gray-500 mt-1">
                    {{ new Date(episode.air_date).toLocaleDateString() }}
                  </p>
                </div>
                <Icon
                  name="i-lucide-play-circle"
                  class="w-5 h-5 text-primary-400 shrink-0"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- No Episodes Message -->
        <div
          v-if="selectedSeason && episodes.length === 0"
          class="text-center py-8 text-gray-400"
        >
          <Icon name="i-lucide-tv" class="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No episodes available for this season</p>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="seriesDetailsError"
        class="text-center py-8 text-gray-400"
      >
        <Icon
          name="i-lucide-alert-circle"
          class="w-8 h-8 mx-auto mb-2 opacity-50"
        />
        <p>{{ seriesDetailsError }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const stalker = useStalkerStore();
const props = defineProps<{
  selectedTab: string;
}>();

const selectedTabRef = computed(() => props.selectedTab);

const {
  seriesDetails,
  loadingSeriesDetails,
  seriesDetailsError,
  seasonItems,
  selectedSeason,
  availableSeasons,
  episodes,
  playEpisode,
} = useSeriesDetails(selectedTabRef);
</script>

<style scoped>
.series-sidebar {
  backdrop-filter: blur(10px);
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
}

.episode-item {
  transition: all 0.2s ease;
}

.episode-item:hover {
  transform: translateX(2px);
}

.episode-item:active {
  transform: translateX(1px) scale(0.98);
}

.series-content {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.series-content::-webkit-scrollbar {
  width: 6px;
}

.series-content::-webkit-scrollbar-track {
  background: transparent;
}

.series-content::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.series-content::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}
</style>
