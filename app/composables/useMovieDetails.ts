// composables/useMovieDetails.ts
export const useMovieDetails = (selectedTab: Ref<string>) => {
  const stalker = useStalkerStore();
  const xtream = useXtreamStore();

  const movieDetails = ref<any>(null);
  const loadingMovieDetails = ref(false);
  const movieDetailsError = ref<string | null>(null);

  // Determine which provider is active
  const providerType = computed(() => {
    if (stalker.token) return "stalker";
    if (xtream.isAuthenticated) return "xtream";
    return null;
  });

  const currentMovie = computed(() => {
    return providerType.value === "stalker"
      ? stalker.currentMovie
      : xtream.currentStream;
  });

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

    // Try searching TMDB by name if no TMDB ID
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

    // Fetch TMDB details if ID exists
    if (tmdbId) {
      try {
        loadingMovieDetails.value = true;
        movieDetailsError.value = null;

        const details = await $fetch(`/api/tmdb/movie`, {
          query: { tmdbId },
        });

        if (details) {
          movieDetails.value = details;
        } else {
          movieDetails.value = mapFallbackMovie(movie);
          movieDetailsError.value = "Showing local movie data";
        }
      } catch (err: any) {
        console.error("Error fetching movie details:", err);
        movieDetails.value = mapFallbackMovie(movie);
        movieDetailsError.value =
          "Failed to load TMDB data, showing local movie";
      } finally {
        loadingMovieDetails.value = false;
      }
    } else {
      movieDetails.value = mapFallbackMovie(movie);
      movieDetailsError.value = "Showing local movie data";
      loadingMovieDetails.value = false;
    }
  }

  function mapFallbackMovie(movie: any) {
    if (providerType.value === "stalker") {
      return {
        title: movie.name,
        overview: movie.description || movie.o_name,
        release_date: movie.year,
        runtime: movie.duration ? parseInt(movie.duration) : null,
        vote_average: movie.rating_imdb ? parseFloat(movie.rating_imdb) : null,
        backdrop_path: movie.screenshot_uri,
        genres: movie.genres_str
          ? movie.genres_str
              .split(" / ")
              .map((g: string) => ({ id: g, name: g }))
          : [],
        production_companies: movie.director
          ? [{ name: movie.director, logo_path: null }]
          : [],
        videos: { results: [] },
        credits: {
          cast: movie.actors
            ? movie.actors.split(",").map((name: string) => ({
                name: name.trim(),
                character: "",
                profile_path: null,
              }))
            : [],
          crew: [],
        },
      };
    } else if (providerType.value === "xtream") {
      // For Xtream, we might have additional info from getVodInfo
      return {
        title: movie.name,
        overview: movie.plot || movie.description,
        release_date: movie.releasedate || movie.year,
        runtime: movie.duration ? parseInt(movie.duration) : null,
        vote_average: movie.rating ? parseFloat(movie.rating) : null,
        backdrop_path:
          movie.stream_icon || movie.cover || movie.backdrop_path?.[0],
        genres: movie.genre
          ? movie.genre
              .split(",")
              .map((g: string) => ({ id: g.trim(), name: g.trim() }))
          : [],
        production_companies: movie.director
          ? [{ name: movie.director, logo_path: null }]
          : [],
        videos: { results: [] },
        credits: {
          cast: movie.cast
            ? movie.cast.split(",").map((name: string) => ({
                name: name.trim(),
                character: "",
                profile_path: null,
              }))
            : [],
          crew: [],
        },
      };
    }

    return null;
  }

  watch(
    () => [currentMovie.value, selectedTab.value],
    async ([newMovie, tab]) => {
      if (tab === "movies" && newMovie) {
        // For Xtream, try to fetch additional VOD info first
        if (providerType.value === "xtream" && newMovie.stream_id) {
          try {
            const vodInfo = await xtream.getVodInfo(newMovie.stream_id);
            if (vodInfo?.info) {
              // Merge additional info into the movie object
              Object.assign(newMovie, vodInfo.info);
            }
          } catch (err) {
            console.error("Failed to fetch VOD info:", err);
          }
        }

        await fetchMovieDetails(newMovie);
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
