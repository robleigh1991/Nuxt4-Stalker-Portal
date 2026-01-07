export const useMovieDetails = (selectedTab: Ref<string>) => {
  const stalker = useStalkerStore();
  const movieDetails = ref<any>(null);
  const loadingMovieDetails = ref(false);
  const movieDetailsError = ref<string | null>(null);

  const trailerVideo = computed(() => {
    if (!movieDetails.value?.videos?.results) return null;
    return (
      movieDetails.value.videos.results.find(
        (video: any) => video.type === "Trailer" && video.site === "YouTube"
      ) || movieDetails.value.videos.results[0]
    );
  });

  async function fetchMovieDetails(movie: any) {
    if (!movie) {
      movieDetails.value = null;
      return;
    }

    let tmdbId = movie.tmdb_id || movie.tmdbId || movie.tmdb || movie.id;

    if (!tmdbId && movie.name) {
      try {
        loadingMovieDetails.value = true;
        movieDetailsError.value = null;

        const searchResults = await $fetch("/api/tmdb/search", {
          method: "POST",
          body: {
            query: movie.name,
            year: movie.year || undefined,
          },
        });

        if (searchResults.results && searchResults.results.length > 0) {
          tmdbId = searchResults.results[0].id;
        }
      } catch (err) {
        console.error("Error searching TMDB:", err);
      }
    }

    if (tmdbId) {
      try {
        loadingMovieDetails.value = true;
        movieDetailsError.value = null;

        const details = await $fetch(`/api/tmdb/movie`, {
          query: { tmdbId },
        });

        movieDetails.value = details;
      } catch (err: any) {
        console.error("Error fetching movie details:", err);
        movieDetailsError.value = err.message || "Failed to load movie details";
        movieDetails.value = null;
      } finally {
        loadingMovieDetails.value = false;
      }
    } else {
      movieDetails.value = null;
      movieDetailsError.value = "TMDB ID not found for this movie";
      loadingMovieDetails.value = false;
    }
  }

  watch(
    () => [stalker.currentMovie, selectedTab.value],
    ([newMovie, tab]) => {
      if (tab === "movies" && newMovie) {
        fetchMovieDetails(newMovie);
      } else {
        movieDetails.value = null;
        movieDetailsError.value = null;
      }
    },
    { immediate: true }
  );

  return {
    movieDetails,
    loadingMovieDetails,
    movieDetailsError,
    trailerVideo,
    fetchMovieDetails,
  };
};
