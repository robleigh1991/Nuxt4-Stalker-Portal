<template>
  <div class="video-section flex-1 flex flex-col relative overflow-hidden">
    <!-- Loading Overlay -->
    <div
      v-if="isLoading"
      class="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div class="text-center">
        <div
          class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"
        ></div>
        <p class="text-white text-lg">Loading stream...</p>
      </div>
    </div>

    <!-- Video Player -->
    <div
      class="video-wrapper flex-1 flex items-center justify-center p-4 bg-black"
    >
      <div
        class="video-container w-full h-full max-w-full max-h-full flex items-center justify-center"
      >
        <video
          ref="videoElement"
          controls
          crossorigin
          playsinline
          autoplay
          class="w-full h-full object-contain rounded-lg shadow-2xl"
        >
          <source
            v-if="sourceUrl"
            :src="proxyUrl"
            type="application/x-mpegURL"
          />
        </video>
      </div>
    </div>

    <!-- Channel Info Bar -->
    <div
      v-if="currentChannel"
      class="channel-info-bar px-6 py-4 bg-gray-800/90 dark:bg-gray-900/90 border-t border-gray-700"
    >
      <div class="flex items-center gap-4">
        <img
          v-if="currentChannel.logo || currentChannel.screenshot_uri"
          :src="currentChannel.logo || currentChannel.screenshot_uri"
          :alt="currentChannel.name"
          class="w-12 h-12 rounded-lg object-contain bg-gray-700 p-1"
          onerror="this.onerror=null; this.src='https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'"
        />
        <div class="flex-1">
          <h3 class="text-xl font-bold text-white">
            {{ currentChannel.name }}
          </h3>
          <p
            v-if="currentChannel.description"
            class="text-sm text-gray-400 mt-1 line-clamp-2"
          >
            {{ currentChannel.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const stalker = useStalkerStore();
const xtream = useXtreamStore();
const toast = useToast();

const providerType = computed(() => {
  if (stalker.token) return "stalker";
  if (xtream.isAuthenticated) return "xtream";
  return null;
});

const sourceUrl = computed(() => {
  return providerType.value === "stalker"
    ? stalker.sourceUrl
    : xtream.sourceUrl;
});

const currentChannel = computed(() => {
  if (providerType.value === "stalker") {
    return stalker.currentChannel || stalker.currentMovie || stalker.currentSeries;
  }
  return xtream.currentStream;
});

const modalOpen = computed(() => {
  return providerType.value === "stalker"
    ? stalker.modalOpen
    : xtream.modalOpen;
});

const videoElement = ref<HTMLVideoElement | null>(null);
const isLoading = ref(false);
const isComponentMounted = ref(false);

let player: any = null;
let retryCount = 0;
const MAX_RETRIES = 3;
let loadingTimeout: NodeJS.Timeout | null = null;
let stopWatcher: (() => void) | null = null;

const proxyUrl = computed(() => {
  if (!sourceUrl.value) return "";
 return `/api/stream-proxy?url=${encodeURIComponent(sourceUrl.value)}`;
});

const options = {
  controls: [
    "play-large",
    "play",
    "progress",
    "current-time",
    "mute",
    "volume",
    "settings",
    "fullscreen",
    "pip",
  ],
  settings: ["quality", "speed"],
  quality: {
    default: 720,
    options: [1080, 720, 480, 360],
  },
};

const getErrorMessage = (code: number): string => {
  const errorMessages: Record<number, string> = {
    1: "Video loading was aborted.",
    2: "Network error occurred. Check your connection.",
    3: "Video format not supported or file corrupted.",
    4: "Video source not available.",
  };
  return errorMessages[code] || "An unknown error occurred.";
};

const handleError = (event: any) => {
  if (!isComponentMounted.value) return;

  const errorCode = videoElement.value?.error?.code || event.detail?.plyr?.code;

  if (errorCode) {
    console.error(`Playback error code ${errorCode}`);
    
    toast.add({
      title: "Playback Error",
      description: getErrorMessage(errorCode),
      color: "red",
      timeout: 5000,
    });
    
    isLoading.value = false;
    clearLoadingTimeout();
  }
};

const clearLoadingTimeout = () => {
  if (loadingTimeout) {
    clearTimeout(loadingTimeout);
    loadingTimeout = null;
  }
};

const setLoadingWithTimeout = (duration: number = 15000) => {
  if (!isComponentMounted.value) return;

  clearLoadingTimeout();
  isLoading.value = true;

  loadingTimeout = setTimeout(() => {
    if (!isComponentMounted.value) return;

    if (isLoading.value) {
      console.warn("Loading timeout exceeded");
      isLoading.value = false;

      if (player && player.paused) {
        toast.add({
          title: "Loading Timeout",
          description: "Stream loading timeout. The stream may be unavailable.",
          color: "red",
          timeout: 5000,
        });
      }
    }
  }, duration);
};

const retryPlayback = async () => {
  if (!isComponentMounted.value) return;

  if (retryCount >= MAX_RETRIES) {
    toast.add({
      title: "Max Retries Reached",
      description: `Failed after ${MAX_RETRIES} attempts. Please try a different stream.`,
      color: "red",
      timeout: 5000,
    });
    return;
  }

  retryCount++;
  setLoadingWithTimeout(20000);

  try {
    if (player && videoElement.value && isComponentMounted.value) {
      await loadSource(sourceUrl.value);
    }
  } catch (err) {
    if (!isComponentMounted.value) return;
    console.error("Retry failed:", err);
  } finally {
    if (isComponentMounted.value) {
      clearLoadingTimeout();
      isLoading.value = false;
    }
  }
};

const loadSource = async (url: string) => {
  if (!player || !videoElement.value || !url || !isComponentMounted.value) return;

  return new Promise<void>(async (resolve, reject) => {
    try {
      if (!isComponentMounted.value) {
        reject(new Error("Component unmounted"));
        return;
      }

      setLoadingWithTimeout(20000);

      const wasPlaying = !player.paused;
      if (wasPlaying) {
        player.pause();
      }

      // Clear existing sources
      const existingSources = videoElement.value?.querySelectorAll("source");
      existingSources?.forEach((src) => src.remove());
      videoElement.value?.removeAttribute("src");

      // Set new source
      const newSource = document.createElement("source");
      newSource.src = `/api/stream-proxy?url=${encodeURIComponent(url)}`
      newSource.type = "application/x-mpegURL";
      videoElement.value?.appendChild(newSource);

      player.source = {
        type: "video",
        sources: [
          {
            src: `/api/stream-proxy?url=${encodeURIComponent(url)}`,
            type: "application/x-mpegURL",
          },
        ],
      };

      if (!isComponentMounted.value) {
        reject(new Error("Component unmounted"));
        return;
      }

      // Wait for canplay event
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Loading timeout")), 10000)
      );

      const canPlayPromise = new Promise<void>((resolve) => {
        const onCanPlay = () => {
          if (!isComponentMounted.value) return;
          videoElement.value?.removeEventListener("canplay", onCanPlay);
          resolve();
        };
        videoElement.value?.addEventListener("canplay", onCanPlay, {
          once: true,
        });
      });

      await nextTick();

      if (!isComponentMounted.value) {
        reject(new Error("Component unmounted"));
        return;
      }

      videoElement.value?.load();

      await Promise.race([canPlayPromise, timeoutPromise]);

      if (!isComponentMounted.value) {
        reject(new Error("Component unmounted"));
        return;
      }

      clearLoadingTimeout();
      isLoading.value = false;

      if (wasPlaying && modalOpen.value) {
        await player.play();
      }

      if (!modalOpen.value) {
        if (providerType.value === "stalker") {
          stalker.modalOpen = true;
        } else if (providerType.value === "xtream") {
          xtream.modalOpen = true;
        }
      }

      retryCount = 0;
      resolve();
    } catch (err: any) {
      if (!isComponentMounted.value) {
        reject(new Error("Component unmounted"));
        return;
      }

      clearLoadingTimeout();
      isLoading.value = false;
      console.error("Error loading source:", err);

      if (retryCount < MAX_RETRIES) {
        setTimeout(() => {
          if (isComponentMounted.value) {
            retryPlayback();
          }
        }, 1000);
      } else {
        toast.add({
          title: "Failed to Load",
          description: err.message || "Failed to load video stream.",
          color: "red",
          timeout: 5000,
        });
      }

      reject(err);
    }
  });
};

onMounted(async () => {
  isComponentMounted.value = true;

  if (process.client && videoElement.value) {
    try {
      const PlyrModule = await import("plyr");
      const Plyr = PlyrModule.default || PlyrModule;
      player = new Plyr(videoElement.value, options);

      player.on("error", handleError);

      player.on("ready", () => {
        if (!isComponentMounted.value) return;
        console.log("Plyr player ready");
        clearLoadingTimeout();
        isLoading.value = false;
      });

      player.on("loadstart", () => {
        if (!isComponentMounted.value) return;
        setLoadingWithTimeout(20000);
      });

      player.on("loadeddata", () => {
        if (!isComponentMounted.value) return;
        clearLoadingTimeout();
        isLoading.value = false;
      });

      player.on("playing", () => {
        if (!isComponentMounted.value) return;
        clearLoadingTimeout();
        isLoading.value = false;
      });

      player.on("waiting", () => {
        if (!isComponentMounted.value) return;
        clearLoadingTimeout();
        loadingTimeout = setTimeout(() => {
          if (!isComponentMounted.value) return;
          if (player && player.paused) {
            isLoading.value = true;
          }
        }, 500);
      });

      player.on("canplay", () => {
        if (!isComponentMounted.value) return;
        clearLoadingTimeout();
        if (isLoading.value && !player.paused) {
          isLoading.value = false;
        }
      });

      videoElement.value.addEventListener("error", handleError);
      
      console.log("Plyr initialized");
    } catch (error) {
      if (!isComponentMounted.value) return;
      console.error("Failed to load Plyr:", error);
      toast.add({
        title: "Initialization Error",
        description: "Failed to initialize video player.",
        color: "red",
        timeout: 0,
      });
    }
  }

  // Setup watcher
  stopWatcher = watch(sourceUrl, async (newUrl, oldUrl) => {
    if (!isComponentMounted.value || newUrl === oldUrl || !newUrl) return;

    setLoadingWithTimeout(20000);
    retryCount = 0;

    if (player && videoElement.value) {
      await loadSource(newUrl);
    }
  });
});

onUnmounted(() => {
  isComponentMounted.value = false;

  if (stopWatcher) {
    stopWatcher();
    stopWatcher = null;
  }

  clearLoadingTimeout();

  if (player) {
    try {
      player.destroy();
    } catch (err) {
      console.error("Error destroying player:", err);
    }
    player = null;
  }

  if (videoElement.value) {
    try {
      videoElement.value.removeEventListener("error", handleError);
      const sources = videoElement.value.querySelectorAll("source");
      sources.forEach((src) => src.remove());
      videoElement.value.removeAttribute("src");
      videoElement.value.load();
      videoElement.value.pause();
    } catch (err) {
      console.error("Error cleaning up video element:", err);
    }
  }

  if (providerType.value === "stalker") {
    stalker.currentChannel = null;
    stalker.currentMovie = null;
    stalker.currentSeries = null;
    stalker.sourceUrl = null;
  } else if (providerType.value === "xtream") {
    xtream.currentStream = null;
    xtream.sourceUrl = null;
  }
});
</script>

<style scoped>
.video-container {
  position: relative;
}

.video-container::before {
  content: "";
  position: absolute;
  inset: -10px;
  background: radial-gradient(
    circle at center,
    rgba(59, 130, 246, 0.1) 0%,
    transparent 70%
  );
  border-radius: 12px;
  pointer-events: none;
  z-index: -1;
}

.channel-info-bar {
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(156, 163, 175, 0.2);
}
</style>