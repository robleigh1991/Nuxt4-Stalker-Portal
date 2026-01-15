// composables/useSeriesDetails.ts
export const useSeriesDetails = (selectedTab: Ref<string>) => {
  const stalker = useStalkerStore();
  const xtream = useXtreamStore();

  const seriesDetails = ref<any>(null);
  const loadingSeriesDetails = ref(false);
  const seriesDetailsError = ref<string | null>(null);

  const selectedSeason = ref<number | null>(null);

  const episodes = ref<any[]>([]);
  const loadingEpisodes = ref(false);

  // Determine which provider is active
  const providerType = computed(() => {
    if (stalker.token) return "stalker";
    if (xtream.isAuthenticated) return "xtream";
    return null;
  });

  const currentSeries = computed(() => {
    return providerType.value === "stalker"
      ? stalker.currentSeries
      : xtream.currentStream;
  });

  const availableSeasons = computed(() => {
    if (providerType.value === "stalker") {
      const seasons =
        stalker.seriesSeasons[stalker.currentSeries?.id + "_seasons"] || [];

      return seasons.map((season: any) => {
        const seasonNumber = Number(season.id.split(":")[1]);

        return {
          label: season.name || `Season ${seasonNumber}`,
          value: seasonNumber,
          seasonNumber,
          iptv: season,
        };
      });
    } else if (providerType.value === "xtream") {
      // Get series info from xtream store
      const seriesInfo =
        xtream.seriesInfo[`series_${xtream.currentStream?.series_id}`];
      if (!seriesInfo || !seriesInfo.episodes) return [];

      // Group episodes by season
      const seasonMap = new Map();

      Object.values(seriesInfo.episodes).forEach((episodeList: any) => {
        episodeList.forEach((episode: any) => {
          const seasonNum = parseInt(episode.season);
          if (!seasonMap.has(seasonNum)) {
            seasonMap.set(seasonNum, {
              label: `Season ${seasonNum}`,
              value: seasonNum,
              seasonNumber: seasonNum,
              episodes: [],
            });
          }
          seasonMap.get(seasonNum).episodes.push(episode);
        });
      });

      return Array.from(seasonMap.values()).sort((a, b) => a.value - b.value);
    }

    return [];
  });

  const seasonItems = computed(() => {
    return availableSeasons.value.map((season: any) => ({
      label: season.label,
      value: season.value,
      raw: season,
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

    if (providerType.value === "stalker") {
      episodes.value = season.iptv.series.map((epNum: number) => ({
        id: `${season.iptv.id}:${epNum}`,
        episode: epNum,
        episode_num: epNum,
        name: `Episode ${epNum}`,
        cmd: season.iptv.cmd,
      }));
    } else if (providerType.value === "xtream") {
      episodes.value = season.episodes || [];
    }
  }

  async function playEpisode(episode: any) {
    if (providerType.value === "stalker") {
      if (!episode?.cmd) return;
      await stalker.createSeriesLink(episode.cmd, "vod", episode.episode);
      stalker.modalOpen = true;
    } else if (providerType.value === "xtream") {
      if (!episode?.id) return;
      const seriesId = xtream.currentStream?.series_id;
      await xtream.playSeriesEpisode(seriesId, episode.id);
    }
  }

  async function fetchSeriesDetails(series: any) {
    if (!series) {
      seriesDetails.value = null;
      return;
    }

    loadingSeriesDetails.value = true; // Start loading
    seriesDetailsError.value = null;

    let tmdbId = series.tmdb_id || series.tmdbId || series.tmdb || series.id;

    // Try searching TMDB by name if no TMDB ID
    if (!tmdbId && series.name) {
      try {
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

    // Fetch TMDB details if ID exists
    if (tmdbId) {
      try {
        const details = await $fetch("/api/tmdb/tv", { query: { tmdbId } });

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
      }
    } else {
      seriesDetails.value = mapFallbackSeries(series);
      seriesDetailsError.value = "Showing local series data";
    }

    loadingSeriesDetails.value = false; // Always stop loading
  }

  function mapFallbackSeries(series: any) {
    if (providerType.value === "stalker") {
      return {
        name: series.name,
        overview: series.description,
        genres: series.genres_str
          ? series.genres_str
              .split(" / ")
              .map((g: string) => ({ id: g, name: g }))
          : [],
        first_air_date: series.year,
        last_air_date: series.year_end || null,
        vote_average: series.rating_imdb || null,
        backdrop_path: series.screenshot_uri,
        videos: { results: [] },
        credits: { cast: [], crew: [] },
        images: { backdrops: [], posters: [], logos: [] },
      };
    } else if (providerType.value === "xtream") {
      const seriesInfo = xtream.seriesInfo[`series_${series.series_id}`];
      return {
        name: series.name || seriesInfo?.info?.name,
        overview: seriesInfo?.info?.plot || series.plot,
        genres: seriesInfo?.info?.genre
          ? seriesInfo.info.genre
              .split(",")
              .map((g: string) => ({ id: g.trim(), name: g.trim() }))
          : [],
        first_air_date: seriesInfo?.info?.releaseDate || null,
        last_air_date: null,
        vote_average: seriesInfo?.info?.rating
          ? parseFloat(seriesInfo.info.rating)
          : null,
        backdrop_path:
          series.cover || seriesInfo?.info?.backdrop_path?.[0] || null,
        number_of_seasons: seriesInfo?.seasons?.length || 0,
        videos: { results: [] },
        credits: {
          cast: seriesInfo?.info?.cast
            ? seriesInfo.info.cast.split(",").map((name: string) => ({
                name: name.trim(),
                character: "",
                profile_path: null,
              }))
            : [],
          crew: [],
        },
        images: { backdrops: [], posters: [], logos: [] },
      };
    }

    return null;
  }

  /**
   * Watchers
   */
  watch(
    () => [currentSeries.value, selectedTab.value],
    async ([series, tab]) => {
      if (tab === "series" && series) {
        if (providerType.value === "stalker" && series.id) {
          await stalker.getSeriesSeasons(series.id);
        } else if (providerType.value === "xtream" && series.series_id) {
          await xtream.getSeriesInfo(series.series_id);
        }
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
        selectedSeason.value = seasons[0].value;
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
