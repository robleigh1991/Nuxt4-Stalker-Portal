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

const getErrorMessage = (code: number, httpStatus?: number): string => {
  // HTTP Error Messages
  if (httpStatus) {
    const httpErrors: Record<number, string> = {
      400: "Bad Request - Invalid stream URL or parameters",
      401: "Unauthorized - Authentication required or expired",
      403: "Forbidden - Access denied to this stream",
      404: "Not Found - Stream no longer available",
      408: "Request Timeout - Server took too long to respond",
      429: "Too Many Requests - Please wait before retrying",
      459: "Stream Offline - This channel is currently unavailable",
      500: "Internal Server Error - Provider issue, try again later",
      502: "Bad Gateway - Server is temporarily unavailable",
      503: "Service Unavailable - Server is overloaded or down",
      504: "Gateway Timeout - Upstream server not responding",
    };
    
    if (httpErrors[httpStatus]) {
      return `${httpErrors[httpStatus]} (HTTP ${httpStatus})`;
    }
    
    // Generic HTTP error
    return `Server Error: HTTP ${httpStatus}`;
  }
  
  // Media Error Messages
  const errorMessages: Record<number, string> = {
    1: "Video loading was aborted.",
    2: "Network error occurred. Check your connection.",
    3: "Video format not supported or file corrupted.",
    4: "Video source not available.",
  };
  return errorMessages[code] || "An unknown error occurred.";
};

const handleError = async (event: any) => {
  if (!isComponentMounted.value) return;

  console.log('[VideoPlayer] Error event:', event);
  
  let errorCode = videoElement.value?.error?.code || event.detail?.plyr?.code;
  let httpStatus: number | undefined;
  let errorMessage = '';

  // Try to detect HTTP errors from the stream URL (only on actual playback errors)
  // We only check this if we have a media error, not on initial load failures
  if (sourceUrl.value && errorCode) {
    try {
      // Attempt to fetch the stream URL to get HTTP status
      const response = await fetch(proxyUrl.value, { 
        method: 'HEAD',
        signal: AbortSignal.timeout(8000) // Increased to 8 seconds
      });
      
      if (!response.ok) {
        httpStatus = response.status;
        console.error(`[VideoPlayer] HTTP Error ${httpStatus} for URL:`, proxyUrl.value);
      }
    } catch (fetchError: any) {
      console.warn('[VideoPlayer] Could not check stream status:', fetchError.message);
      // Don't set httpStatus if we can't check - some streams don't support HEAD
    }
  }

  // Get appropriate error message
  errorMessage = getErrorMessage(errorCode || 0, httpStatus);
  
  console.error(`[VideoPlayer] Playback error:`, {
    errorCode,
    httpStatus,
    message: errorMessage,
    url: proxyUrl.value
  });
  
  // Show user-friendly error with retry option for temporary errors
  const isRetryableError = httpStatus && [429, 500, 502, 503, 504].includes(httpStatus);
  
  toast.add({
    title: httpStatus ? `Stream Error (${httpStatus})` : "Playback Error",
    description: errorMessage,
    color: "red",
    timeout: isRetryableError ? 8000 : 5000,
    actions: isRetryableError ? [{
      label: 'Retry',
      click: () => {
        console.log('[VideoPlayer] User initiated retry');
        retryPlayback();
      }
    }] : undefined,
  });
  
  isLoading.value = false;
  clearLoadingTimeout();
};

const clearLoadingTimeout = () => {
  if (loadingTimeout) {
    clearTimeout(loadingTimeout);
    loadingTimeout = null;
  }
};

const setLoadingWithTimeout = (duration: number = 45000) => {
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
          description: "Stream is taking longer than expected. Please try again.",
          color: "orange",
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
  setLoadingWithTimeout(60000); // 60 seconds for retry - give it more time

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

      const streamUrl = `/api/stream-proxy?url=${encodeURIComponent(url)}`;
      console.log('[VideoPlayer] Loading source:', streamUrl);

      // Optional: Check if stream URL is accessible before loading
      // Note: This is a soft check - we continue even if it fails
      // because some streams don't support HEAD requests
      try {
        const checkResponse = await fetch(streamUrl, {
          method: 'HEAD',
          signal: AbortSignal.timeout(8000) // Increased to 8 seconds
        });
        
        if (checkResponse.ok) {
          console.log('[VideoPlayer] Pre-stream check passed');
        } else {
          console.warn(`[VideoPlayer] Pre-stream check returned HTTP ${checkResponse.status}, continuing anyway`);
        }
      } catch (checkError: any) {
        console.warn('[VideoPlayer] Pre-stream check failed:', checkError.message, '- continuing anyway');
        // Continue anyway - many streams don't support HEAD requests or have CORS issues
      }

      setLoadingWithTimeout(60000); // 60 seconds - IPTV streams need time to buffer

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
      newSource.src = streamUrl;
      newSource.type = "application/x-mpegURL";
      videoElement.value?.appendChild(newSource);

      player.source = {
        type: "video",
        sources: [
          {
            src: streamUrl,
            type: "application/x-mpegURL",
          },
        ],
      };

      if (!isComponentMounted.value) {
        reject(new Error("Component unmounted"));
        return;
      }

      // Wait for canplay event with extended timeout for IPTV streams
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Loading timeout")), 45000) // 45 seconds
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
        console.log("[VideoPlayer] Plyr player ready");
        clearLoadingTimeout();
        isLoading.value = false;
      });

      player.on("loadstart", () => {
        if (!isComponentMounted.value) return;
        setLoadingWithTimeout(60000); // 60 seconds for IPTV streams
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
      
      // Add additional error listener for network issues
      videoElement.value.addEventListener("stalled", () => {
        if (!isComponentMounted.value) return;
        console.warn("[VideoPlayer] Stream stalled - network issue");
        toast.add({
          title: "Buffering Issue",
          description: "Stream is experiencing network issues. Trying to recover...",
          color: "orange",
          timeout: 3000,
        });
      });
      
      console.log("[VideoPlayer] Plyr initialized");
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

    setLoadingWithTimeout(60000); // 60 seconds for IPTV streams
    retryCount = 0;

    if (player && videoElement.value) {
      await loadSource(newUrl);
    }
  });
});

onUnmounted(() => {
  console.log('[VideoPlayer] Cleaning up component...');
  isComponentMounted.value = false;

  // Stop watcher first
  if (stopWatcher) {
    stopWatcher();
    stopWatcher = null;
  }

  // Clear any pending timeouts
  clearLoadingTimeout();

  // Comprehensive Plyr cleanup
  if (player) {
    try {
      console.log('[VideoPlayer] Destroying Plyr instance');
      
      // Remove all Plyr event listeners
      player.off('error');
      player.off('ready');
      player.off('loadstart');
      player.off('loadeddata');
      player.off('playing');
      player.off('waiting');
      player.off('canplay');
      player.off('pause');
      player.off('ended');
      player.off('timeupdate');
      player.off('volumechange');
      player.off('seeked');
      player.off('seeking');
      
      // Stop playback
      if (!player.paused) {
        player.pause();
      }
      
      // Destroy Plyr instance
      player.destroy();
      player = null;
      
      console.log('[VideoPlayer] Plyr destroyed successfully');
    } catch (err) {
      console.error('[VideoPlayer] Error destroying player:', err);
    }
  }

  // Comprehensive video element cleanup
  if (videoElement.value) {
    try {
      console.log('[VideoPlayer] Cleaning video element');
      
      // Pause and clear current time
      videoElement.value.pause();
      videoElement.value.currentTime = 0;
      
      // Remove all event listeners
      videoElement.value.removeEventListener("error", handleError);
      videoElement.value.removeEventListener("loadstart", () => {});
      videoElement.value.removeEventListener("canplay", () => {});
      videoElement.value.removeEventListener("error", () => {});
      
      // Remove all sources
      const sources = videoElement.value.querySelectorAll("source");
      sources.forEach((src) => {
        src.removeAttribute('src');
        src.remove();
      });
      
      // Clear src attribute
      videoElement.value.removeAttribute("src");
      videoElement.value.srcObject = null;
      
      // Force garbage collection of media buffers
      videoElement.value.load();
      
      // Additional cleanup for memory
      videoElement.value.poster = '';
      videoElement.value.preload = 'none';
      
      console.log('[VideoPlayer] Video element cleaned');
    } catch (err) {
      console.error('[VideoPlayer] Error cleaning up video element:', err);
    }
  }

  // Clear store references
  try {
    if (providerType.value === "stalker") {
      stalker.currentChannel = null;
      stalker.currentMovie = null;
      stalker.currentSeries = null;
      stalker.sourceUrl = null;
    } else if (providerType.value === "xtream") {
      xtream.currentStream = null;
      xtream.sourceUrl = null;
    }
    console.log('[VideoPlayer] Store references cleared');
  } catch (err) {
    console.error('[VideoPlayer] Error clearing store references:', err);
  }

  // Force garbage collection hint (if available)
  if (typeof window !== 'undefined' && (window as any).gc) {
    try {
      (window as any).gc();
      console.log('[VideoPlayer] Garbage collection triggered');
    } catch (e) {
      // GC not available, that's okay
    }
  }
  
  console.log('[VideoPlayer] Cleanup complete');
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