<template>
  <div
    v-if="stalker.currentMovie"
    class="movie-sidebar w-96 bg-gray-800/95 dark:bg-gray-900/95 border-l border-gray-700 flex flex-col overflow-hidden"
  >
    <!-- Movie Header with Background -->
    <div v-if="movieDetails" class="movie-header relative h-64 overflow-hidden">
      <img
        v-if="movieDetails.backdrop_path"
        :src="`https://image.tmdb.org/t/p/w1280${movieDetails.backdrop_path}`"
        :alt="movieDetails.title"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"
      ></div>
      <div class="relative z-10 p-4 h-full flex flex-col justify-end">
        <h2 class="text-2xl font-bold text-white mb-2">
          {{ movieDetails.title }}
        </h2>
        <div class="flex items-center gap-3 text-sm text-gray-300">
          <span v-if="movieDetails.release_date">
            {{ new Date(movieDetails.release_date).getFullYear() }}
          </span>
          <span v-if="movieDetails.runtime">
            {{ Math.floor(movieDetails.runtime / 60) }}h
            {{ movieDetails.runtime % 60 }}m
          </span>
          <div class="flex items-center gap-1">
            <Icon name="i-lucide-star" class="w-4 h-4 text-yellow-400" />
            <span>{{ movieDetails.vote_average?.toFixed(1) }}</span>
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

    <!-- Movie Content -->
    <div class="movie-content flex-1 overflow-y-auto p-4">
      <!-- Loading State -->
      <div v-if="loadingMovieDetails" class="text-center py-8">
        <Icon
          name="i-lucide-loader-2"
          class="w-8 h-8 mx-auto mb-2 animate-spin text-primary-400"
        />
        <p class="text-gray-400">Loading movie details...</p>
      </div>

      <!-- Movie Details -->
      <div v-else-if="movieDetails">
        <!-- Overview -->
        <div class="mb-4">
          <h3 class="text-lg font-semibold text-white mb-2">Overview</h3>
          <p class="text-sm text-gray-300 leading-relaxed">
            {{ movieDetails.overview }}
          </p>
        </div>

        <!-- Genres -->
        <div v-if="movieDetails.genres?.length" class="mb-4">
          <h3 class="text-lg font-semibold text-white mb-2">Genres</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="genre in movieDetails.genres"
              :key="genre.id"
              class="px-2 py-1 text-xs rounded-full bg-primary-600/30 text-primary-200"
            >
              {{ genre.name }}
            </span>
          </div>
        </div>

        <!-- Cast -->
        <div v-if="movieDetails.credits?.cast?.length" class="mb-4">
          <h3 class="text-lg font-semibold text-white mb-2">Cast</h3>
          <div class="space-y-2">
            <div
              v-for="actor in movieDetails.credits.cast.slice(0, 10)"
              :key="actor.id"
              class="flex items-center gap-3 p-2 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors"
            >
              <img
                v-if="actor.profile_path"
                :src="`https://image.tmdb.org/t/p/w92${actor.profile_path}`"
                :alt="actor.name"
                class="w-12 h-12 rounded-full object-cover"
              />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-white truncate">
                  {{ actor.name }}
                </p>
                <p class="text-xs text-gray-400 truncate">
                  {{ actor.character }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Trailer -->
        <div v-if="trailerVideo" class="mb-4">
          <h3 class="text-lg font-semibold text-white mb-2">Trailer</h3>
          <div
            class="relative aspect-video rounded-lg overflow-hidden bg-gray-800"
          >
            <iframe
              :src="`https://www.youtube.com/embed/${trailerVideo.key}`"
              class="absolute inset-0 w-full h-full"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </div>

        <!-- Production Companies -->
        <div v-if="movieDetails.production_companies?.length" class="mb-4">
          <h3 class="text-lg font-semibold text-white mb-2">Production</h3>
          <div class="flex flex-wrap gap-3">
            <div
              v-for="company in movieDetails.production_companies.slice(0, 5)"
              :key="company.id"
              class="flex items-center gap-2"
            >
              <img
                v-if="company.logo_path"
                :src="`https://image.tmdb.org/t/p/w92${company.logo_path}`"
                :alt="company.name"
                class="h-8 object-contain bg-white rounded p-1"
              />
              <span class="text-xs text-gray-400">{{ company.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="movieDetailsError" class="text-center py-8 text-gray-400">
        <Icon
          name="i-lucide-alert-circle"
          class="w-8 h-8 mx-auto mb-2 opacity-50"
        />
        <p>{{ movieDetailsError }}</p>
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

const { movieDetails, loadingMovieDetails, movieDetailsError, trailerVideo } =
  useMovieDetails(selectedTabRef);
</script>

<style scoped>
.movie-sidebar {
  backdrop-filter: blur(10px);
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
}

.movie-content {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.movie-content::-webkit-scrollbar {
  width: 6px;
}

.movie-content::-webkit-scrollbar-track {
  background: transparent;
}

.movie-content::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.movie-content::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}
</style>
