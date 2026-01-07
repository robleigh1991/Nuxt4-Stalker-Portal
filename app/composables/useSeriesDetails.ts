export const useSeriesDetails = (selectedTab: Ref<string>) => {
  const stalker = useStalkerStore();

  const seriesDetails = ref<any>(null);
  const loadingSeriesDetails = ref(false);
  const seriesDetailsError = ref<string | null>(null);

  const selectedSeason = ref<number | null>(null);

  const episodes = ref<any[]>([]);
  const loadingEpisodes = ref(false);

  const availableSeasons = computed(() => {
    const seasons =
      stalker.seriesSeasons[stalker.currentSeries?.id + "_seasons"] || [];

    return seasons.map((season: any) => {
      const seasonNumber = Number(season.id.split(":")[1]);

      return {
        label: season.name || `Season ${seasonNumber}`,
        value: seasonNumber,
        seasonNumber,
        iptv: season, // keep original IPTV season attached
      };
    });
  });

  const seasonItems = computed(() => {
    return availableSeasons.value.map((season: any) => ({
      label: season.label, // what you see in the dropdown
      value: season.value, // what gets stored in v-model
      raw: season, // keep the original data around
    }));
  });

  async function fetchEpisodes() {
    if (!selectedSeason.value) return;

    const season = availableSeasons.value.find(
      (s: any) => s.value === selectedSeason.value
    );

    if (!season) {
      episodes.value = [];
      return;
    }

    episodes.value = season.iptv.series.map((epNum: number) => ({
      id: `${season.iptv.id}:${epNum}`,
      episode: epNum,
      name: `Episode ${epNum}`,
      cmd: season.iptv.cmd,
    }));
  }

  async function playEpisode(episode: any) {
    if (!episode?.cmd) return;

    await stalker.createSeriesLink(episode.cmd, "vod", episode.episode);
    stalker.modalOpen = true;
  }

  async function fetchSeriesDetails(series: any) {
    if (!series) {
      seriesDetails.value = null;
      return;
    }

    let tmdbId = series.tmdb_id || series.tmdbId || series.tmdb || series.id;

    // --- Try searching TMDB by name if no TMDB ID ---
    if (!tmdbId && series.name) {
      try {
        loadingSeriesDetails.value = true;
        seriesDetailsError.value = null;

        const searchResults = await $fetch("/api/tmdb/search-tv", {
          method: "POST",
          body: { query: series.name, year: series.year || undefined },
        });

        if (searchResults.results?.length) {
          tmdbId = searchResults.results[0].id;
        }
      } catch (err) {
        console.error("Error searching TMDB:", err);
      }
    }

    // --- Fetch TMDB details if ID exists ---
    if (tmdbId) {
      try {
        loadingSeriesDetails.value = true;
        seriesDetailsError.value = null;

        const details = await $fetch("/api/tmdb/tv", { query: { tmdbId } });

        // If TMDB returns null or fails, fallback
        if (details) {
          seriesDetails.value = details;
        } else {
          seriesDetails.value = mapFallbackSeries(series);
          seriesDetailsError.value = "Showing local series data";
        }
      } catch (err: any) {
        console.error("TMDB fetch error:", err);
        seriesDetails.value = mapFallbackSeries(series);
        seriesDetailsError.value =
          "Failed to load TMDB data, showing local series";
      } finally {
        loadingSeriesDetails.value = false;
      }
    } else {
      // No TMDB ID at all — fallback immediately
      seriesDetails.value = mapFallbackSeries(series);
      seriesDetailsError.value = "Showing local series data";
    }
  }

  // --- Helper to map stalker.currentSeries to TMDB-like shape ---
  function mapFallbackSeries(series: any) {
    console.log(series);
    return {
      name: series.name,
      overview: series.description,
      genres: series.genres_str
        ? series.genres_str.split(" / ").map((g) => ({ id: g, name: g }))
        : [],
      first_air_date: series.year,
      last_air_date: series.year_end || null,
      vote_average: series.rating_imdb || null,
      backdrop_path: series.screenshot_uri,
      videos: { results: [] },
      credits: { cast: [], crew: [] },
      images: { backdrops: [], posters: [], logos: [] },
    };
  }

  /**
   * Watchers
   */
  watch(
    () => [stalker.currentSeries, selectedTab.value],
    async ([series, tab]) => {
      if (tab === "series" && series) {
        await stalker.getSeriesSeasons(series.id);
        await fetchSeriesDetails(series);
      } else {
        selectedSeason.value = null;
        episodes.value = [];
        seriesDetails.value = null;
      }
    },
    { immediate: true }
  );

  watch(
    availableSeasons,
    (seasons) => {
      if (!seasons.length) return;

      if (selectedSeason.value == null) {
        selectedSeason.value = seasons[0].value; // ✅ NUMBER
        fetchEpisodes();
      }
    },
    { immediate: true }
  );

  watch(selectedSeason, fetchEpisodes);

  return {
    seriesDetails,
    loadingSeriesDetails,
    seriesDetailsError,
    seasonItems,
    selectedSeason,
    availableSeasons,
    episodes,
    playEpisode,
  };
};
