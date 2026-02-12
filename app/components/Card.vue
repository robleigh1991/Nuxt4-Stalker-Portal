<template>
  <div
    v-if="item"
    class="netflix-card group aspect-[2/3] bg-gray-900 cursor-pointer"
    :class="{
      'ring-2 ring-primary-500': selectedItem === item
    }"
    tabindex="0"
    role="button"
    @click="$emit('click')"
    @keydown.enter.prevent="$emit('click')"
  >
    <!-- Image Container -->
    <div class="relative w-full h-full overflow-hidden bg-gray-900">
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

      <!-- Footer with Title (Inside relative container) -->
      <div class="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
        <h3 class="text-xs font-medium text-white line-clamp-2 drop-shadow-md">
           {{ name }}
        </h3>
      </div>
    </div>
  </div>
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
