<template>
  <UCard
    v-if="item"
    class="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
    :class="{
      'ring-2 ring-primary-500 shadow-lg shadow-primary-500/50':
        selectedItem === item,
    }"
    :ui="{
      body: { padding: 'p-0' },
      footer: { padding: 'p-3' },
    }"
    @click="$emit('click')"
  >
    <!-- Image Container -->
    <div class="relative aspect-[3/4] overflow-hidden bg-gray-900">
      <!-- Shimmer Loading Effect -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"
      ></div>

      <!-- Image -->
      <NuxtImg
        v-if="image"
        :src="image"
        :alt="name"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
        @error="handleImageError"
      />
      <img
        v-else
        src="https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
        :alt="name"
        class="w-full h-full object-contain p-8 opacity-50"
      />

      <!-- Gradient Overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      ></div>

      <!-- Favorite Button -->
      <button
        v-if="showFavoriteButton"
        @click.stop="toggleFavorite"
        class="absolute top-2 right-2 p-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm transition-all duration-200 z-20"
        :class="{ 'opacity-100': isFavorited, 'opacity-0 group-hover:opacity-100': !isFavorited }"
        :title="isFavorited ? 'Remove from favorites' : 'Add to favorites'"
      >
        <UIcon
          :name="isFavorited ? 'i-lucide-heart' : 'i-lucide-heart'"
          class="w-5 h-5 transition-colors"
          :class="isFavorited ? 'text-red-500 fill-red-500' : 'text-white'"
        />
      </button>

      <!-- Play Icon Overlay -->
      <div
        class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
      >
        <div
          class="bg-primary-600 rounded-full p-4 transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-xl"
        >
          <svg
            class="w-8 h-8 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      <!-- Selected Badge -->
      <div
        v-if="selectedItem === item"
        class="absolute top-2 left-2 bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 z-10"
      >
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        Playing
      </div>
    </div>

    <!-- Footer with Title -->
    <template #footer>
      <div class="space-y-1">
        <h3
          class="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight min-h-[2.5rem]"
        >
          {{ name }}
        </h3>

        <!-- Optional: Add metadata if available -->
        <div
          v-if="item.rating || item.year"
          class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
        >
          <span v-if="item.rating" class="flex items-center gap-1">
            <svg
              class="w-3 h-3 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
            {{ item.rating }}
          </span>
          <span v-if="item.year" class="text-gray-400">•</span>
          <span v-if="item.year">{{ item.year }}</span>
        </div>
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
interface Props {
  item: any;
  selectedItem?: any;
  name: string;
  image?: string;
  loading?: boolean;
  contentType?: 'live' | 'movies' | 'series';
  providerType?: 'stalker' | 'xtream';
  showFavoriteButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showFavoriteButton: true,
});

defineEmits(['click']);

const favorites = useFavorites();

// Generate unique ID for the item
const itemId = computed(() => {
  if (props.item?.stream_id) {
    return `${props.providerType}_${props.contentType}_${props.item.stream_id}`;
  }
  if (props.item?.id) {
    return `${props.providerType}_${props.contentType}_${props.item.id}`;
  }
  if (props.item?.series_id) {
    return `${props.providerType}_${props.contentType}_${props.item.series_id}`;
  }
  return `${props.providerType}_${props.contentType}_${props.name}`;
});

// Check if item is favorited
const isFavorited = computed(() => {
  return favorites.isFavorite(itemId.value);
});

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.onerror = null;
  target.src =
    "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
  target.classList.add("object-contain", "p-8", "opacity-50");
};

const toggleFavorite = () => {
  if (!props.contentType || !props.providerType) {
    console.warn('contentType and providerType are required for favorites');
    return;
  }

  favorites.toggle(
    itemId.value,
    props.providerType,
    props.contentType,
    props.name,
    props.item,
    props.image
  );
};
</script>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

/* Ensure proper aspect ratio */
.aspect-\[3\/4\] {
  aspect-ratio: 3 / 4;
}

/* Line clamp for title */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
