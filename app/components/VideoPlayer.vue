<template>
  <div class="video-section flex-1 flex flex-col relative overflow-hidden">
    <!-- Error Overlay -->
    <div
      v-if="errorState.hasError"
      class="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <div class="text-center p-8 max-w-md">
        <div class="mb-4">
          <svg
            class="w-16 h-16 mx-auto text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-white mb-2">Playback Error</h3>
        <p class="text-gray-300 mb-4">{{ errorState.message }}</p>
        <div class="flex gap-3 justify-center">
          <button
            @click="retryPlayback"
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
          <button
            @click="clearError"
            class="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>

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
          v-if="currentChannel.logo"
          :src="currentChannel.logo"
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

// Determine active provider
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
  return providerType.value === "stalker"
    ? stalker.currentChannel
    : xtream.currentStream;
});

const modalOpen = computed(() => {
  return providerType.value === "stalker"
    ? stalker.modalOpen
    : xtream.modalOpen;
});

const videoElement = ref<HTMLVideoElement | null>(null);
const isLoading = ref(false);
const isComponentMounted = ref(false);
const errorState = reactive({
  hasError: false,
  message: "",
  code: null as number | null,
});

let player: any = null;
let retryCount = 0;
const MAX_RETRIES = 3;
let loadingTimeout: NodeJS.Timeout | null = null;
let stopWatcher: (() => void) | null = null;

const proxyUrl = computed(() => {
  if (!sourceUrl.value) return "";
  return (
    "http://nuxt4iptv.test/backend/proxy.php?url=" +
    encodeURIComponent(sourceUrl.value)
  );
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
    1: "The video loading was aborted. Please try again.",
    2: "A network error occurred while loading the video. Check your connection.",
    3: "The video format is not supported or the file is corrupted.",
    4: "The video source is not available or cannot be found.",
  };
  return (
    errorMessages[code] ||
    "An unknown error occurred. Please try again or contact support."
  );
};

const handleError = (event: any) => {
  if (!isComponentMounted.value) return;

  const errorCode = videoElement.value?.error?.code || event.detail?.plyr?.code;

  if (errorCode) {
    errorState.hasError = true;
    errorState.code = errorCode;
    errorState.message = getErrorMessage(errorCode);
    isLoading.value = false;
    clearLoadingTimeout();
    console.error(`Playback error code ${errorCode}:`, errorState.message);
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

      // If video is still not playing, show error
      if (player && player.paused && !errorState.hasError) {
        errorState.hasError = true;
        errorState.message =
          "Stream loading timeout. The stream may be slow or unavailable.";
      }
    }
  }, duration);
};

const clearError = () => {
  errorState.hasError = false;
  errorState.message = "";
  errorState.code = null;
  retryCount = 0;
  clearLoadingTimeout();
};

const retryPlayback = async () => {
  if (!isComponentMounted.value) return;

  if (retryCount >= MAX_RETRIES) {
    errorState.message = `Failed after ${MAX_RETRIES} attempts. Please check your connection or try a different stream.`;
    return;
  }

  retryCount++;
  clearError();
  setLoadingWithTimeout(20000);

  try {
    if (player && videoElement.value && isComponentMounted.value) {
      await loadSource(sourceUrl.value);
    }
  } catch (err) {
    if (!isComponentMounted.value) return;

    console.error("Retry failed:", err);
    errorState.hasError = true;
    errorState.message = "Retry failed. Please try again.";
  } finally {
    if (isComponentMounted.value) {
      clearLoadingTimeout();
      isLoading.value = false;
    }
  }
};

const loadSource = async (url: string) => {
  if (!player || !videoElement.value || !url || !isComponentMounted.value)
    return;

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

      if (!isComponentMounted.value) {
        reject(new Error("Component unmounted"));
        return;
      }

      // Clear existing sources
      const existingSources = videoElement.value?.querySelectorAll("source");
      existingSources?.forEach((src) => src.remove());
      videoElement.value?.removeAttribute("src");

      // Set new source
      const newSource = document.createElement("source");
      newSource.src =
        "http://nuxt4iptv.test/backend/proxy.php?url=" +
        encodeURIComponent(url);
      newSource.type = "application/x-mpegURL";
      videoElement.value?.appendChild(newSource);

      player.source = {
        type: "video",
        sources: [
          {
            src:
              "http://nuxt4iptv.test/backend/proxy.php?url=" +
              encodeURIComponent(url),
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
        errorState.hasError = true;
        errorState.message = err.message || "Failed to load video stream.";
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
        console.log("Plyr player is ready");
        clearLoadingTimeout();
        isLoading.value = false;
      });

      player.on("loadstart", () => {
        if (!isComponentMounted.value) return;
        console.log("Plyr started loading source");
        setLoadingWithTimeout(20000);
      });

      player.on("loadeddata", () => {
        if (!isComponentMounted.value) return;
        clearLoadingTimeout();
        isLoading.value = false;
      });

      player.on("playing", () => {
        if (!isComponentMounted.value) return;
        clearError();
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

      player.on("seeking", () => {
        if (!isComponentMounted.value) return;
        console.log("User is seeking");
        setLoadingWithTimeout(10000);
      });

      player.on("seeked", () => {
        if (!isComponentMounted.value) return;
        console.log("Seek completed");
        clearLoadingTimeout();
        setTimeout(() => {
          if (!isComponentMounted.value) return;
          if (!player.paused) {
            isLoading.value = false;
          }
        }, 100);
      });

      player.on("stalled", () => {
        if (!isComponentMounted.value) return;
        console.warn("Playback stalled");
        if (!errorState.hasError) {
          setLoadingWithTimeout(15000);
        }
      });

      player.on("canplay", () => {
        if (!isComponentMounted.value) return;
        clearLoadingTimeout();
        if (isLoading.value && !player.paused) {
          isLoading.value = false;
        }
      });

      videoElement.value.addEventListener("error", handleError);
    } catch (error) {
      if (!isComponentMounted.value) return;
      console.error("Failed to load Plyr:", error);
      errorState.hasError = true;
      errorState.message = "Failed to initialize video player.";
    }
  }

  // Setup watcher after mount
  stopWatcher = watch(sourceUrl, async (newUrl, oldUrl) => {
    if (!isComponentMounted.value || newUrl === oldUrl || !newUrl) return;

    setLoadingWithTimeout(20000);
    clearError();
    retryCount = 0;

    if (player && videoElement.value) {
      await loadSource(newUrl);
    } else if (newUrl && videoElement.value) {
      await nextTick();

      if (player && videoElement.value && isComponentMounted.value) {
        await loadSource(newUrl);
      }
    }
  });
});

onUnmounted(() => {
  isComponentMounted.value = false;

  // Stop the watcher first
  if (stopWatcher) {
    stopWatcher();
    stopWatcher = null;
  }

  clearLoadingTimeout();

  // Remove all event listeners before destroying
  if (player) {
    try {
      player.off("error");
      player.off("ready");
      player.off("loadstart");
      player.off("loadeddata");
      player.off("playing");
      player.off("waiting");
      player.off("seeking");
      player.off("seeked");
      player.off("stalled");
      player.off("canplay");
      player.destroy();
    } catch (err) {
      console.error("Error destroying player:", err);
    }
    player = null;
  }

  if (videoElement.value) {
    try {
      videoElement.value.removeEventListener("error", handleError);
      // Clear all sources
      const sources = videoElement.value.querySelectorAll("source");
      sources.forEach((src) => src.remove());
      videoElement.value.removeAttribute("src");
      videoElement.value.load(); // Stop any loading
      videoElement.value.pause(); // Ensure playback is stopped
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

  clearError();
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
