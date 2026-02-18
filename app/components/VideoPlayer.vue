<template>
  <div class="video-section flex-1 flex flex-col relative overflow-hidden">
    <!-- Loading Overlay -->
    <div
      v-if="isLoading"
      class="absolute inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-md"
    >
      <div class="text-center">
        <div
          class="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"
        ></div>
        <p class="text-white font-medium">Loading {{ streamFormat.name }} video...</p>
        <p class="text-gray-400 text-sm mt-1">{{ streamFormat.mimeType }}</p>
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
            :type="streamFormat.mimeType"
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
          <div class="flex items-center justify-between mb-1">
            <h3 class="text-xl font-bold text-white">
              {{ currentChannel.name }}
            </h3>
            <!-- Current Program Short Info -->
            <div v-if="currentProgram" class="flex items-center gap-2 text-primary-400 font-mono text-xs">
              <span class="font-bold uppercase tracking-widest text-[10px]">Now:</span>
              <span>{{ currentProgram.title || currentProgram.t_name }}</span>
            </div>
          </div>
          
          <!-- Program Description or Channel Description -->
          <p
            class="text-sm text-gray-400 mt-1 line-clamp-1"
          >
            {{ currentProgram ? (currentProgram.description || currentProgram.descr) : currentChannel.description }}
          </p>

          <!-- Simple Progress Bar for current show -->
          <div v-if="currentProgram" class="mt-3 w-full max-w-sm">
            <UProgress :value="programProgress" color="primary" size="xs" />
          </div>
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
const currentTime = ref(Date.now());

// Timer for current program updates
let timeUpdateInterval: NodeJS.Timeout;

// Current EPG Data helper
const currentEPGData = computed(() => {
  if (!currentChannel.value) return [];
  const id = providerType.value === 'stalker' 
    ? currentChannel.value.id 
    : currentChannel.value.stream_id;
    
  return providerType.value === 'stalker' 
    ? stalker.epgData[id] || [] 
    : xtream.epgData[id] || [];
});

const currentProgram = computed(() => {
  if (!currentEPGData.value.length) return null;
  
  return currentEPGData.value.find((p: any) => {
    let start, end;
    if (providerType.value === 'stalker') {
      start = new Date(p.start || p.t_time).getTime();
      end = new Date(p.end || p.t_time_to).getTime();
    } else {
      start = new Date(p.start || p.start_timestamp).getTime();
      end = new Date(p.end || p.end_timestamp).getTime();
    }
    return currentTime.value >= start && currentTime.value < end;
  });
});

const programProgress = computed(() => {
  if (!currentProgram.value) return 0;
  let start, end;
  if (providerType.value === 'stalker') {
    start = new Date(currentProgram.value.start || currentProgram.value.t_time).getTime();
    end = new Date(currentProgram.value.end || currentProgram.value.t_time_to).getTime();
  } else {
    start = new Date(currentProgram.value.start || currentProgram.value.start_timestamp).getTime();
    end = new Date(currentProgram.value.end || currentProgram.value.end_timestamp).getTime();
  }
  
  const total = end - start;
  const elapsed = currentTime.value - start;
  return Math.round((elapsed / total) * 100);
});

let player: any = null;
let retryCount = 0;
const MAX_RETRIES = 3;
let loadingTimeout: NodeJS.Timeout | null = null;
let stopWatcher: (() => void) | null = null;
let hasTriedM3u8Fallback = false; // Track if we've tried .m3u8 fallback for .ts

// Helper function to convert .ts URL to .m3u8 for fallback
const convertTsToM3u8 = (url: string): string => {
  let converted = url;

  // Replace extension in URL path
  converted = converted.replace(/\.ts$/i, '.m3u8');

  // Replace ext= parameter
  converted = converted.replace(/ext=\.?ts/gi, 'ext=.m3u8');
  converted = converted.replace(/extension=\.?ts/gi, 'extension=.m3u8');

  console.log('[VideoPlayer] Converted URL:', { original: url, converted });
  return converted;
};

// Detect video format from URL - supports all IPTV formats
const streamFormat = computed(() => {
  if (!sourceUrl.value) return { type: 'hls', mimeType: 'application/x-mpegURL', name: 'HLS' };

  const url = sourceUrl.value.toLowerCase();

  // Extract extension from URL (handle query parameters)
  const urlWithoutQuery = url.split('?')[0];
  const extension = urlWithoutQuery.split('.').pop() || '';

  // Also check ext= parameter
  const extMatch = url.match(/ext=\.?(\w+)/);
  const extParam = extMatch ? extMatch[1] : '';

  const finalExt = extParam || extension;

  // HLS - HTTP Live Streaming (.m3u8)
  if (finalExt === 'm3u8' || url.includes('.m3u8')) {
    return { type: 'hls', mimeType: 'application/x-mpegURL', name: 'HLS' };
  }

  // MPEG-TS - Transport Stream (.ts)
  if (finalExt === 'ts' || url.includes('ext=.ts')) {
    return { type: 'mpegts', mimeType: 'video/mp2t', name: 'MPEG-TS' };
  }

  // MP4 - Most common for VOD/Movies (.mp4, .m4v)
  if (finalExt === 'mp4' || finalExt === 'm4v') {
    return { type: 'mp4', mimeType: 'video/mp4', name: 'MP4' };
  }

  // MKV - Matroska (common for series/movies) (.mkv)
  if (finalExt === 'mkv') {
    return { type: 'mkv', mimeType: 'video/x-matroska', name: 'MKV' };
  }

  // AVI - Older format but still used (.avi)
  if (finalExt === 'avi') {
    return { type: 'avi', mimeType: 'video/x-msvideo', name: 'AVI' };
  }

  // WebM - Web video format (.webm)
  if (finalExt === 'webm') {
    return { type: 'webm', mimeType: 'video/webm', name: 'WebM' };
  }

  // MOV - QuickTime (.mov)
  if (finalExt === 'mov') {
    return { type: 'mov', mimeType: 'video/quicktime', name: 'MOV' };
  }

  // FLV - Flash Video (rare but exists) (.flv)
  if (finalExt === 'flv') {
    return { type: 'flv', mimeType: 'video/x-flv', name: 'FLV' };
  }

  // OGG/OGV - Ogg Video (.ogv, .ogg)
  if (finalExt === 'ogv' || finalExt === 'ogg') {
    return { type: 'ogg', mimeType: 'video/ogg', name: 'OGG' };
  }

  // DASH - Dynamic Adaptive Streaming (.mpd)
  if (finalExt === 'mpd') {
    return { type: 'dash', mimeType: 'application/dash+xml', name: 'DASH' };
  }

  // Default to MP4 if unknown (most compatible)
  console.warn('[VideoPlayer] Unknown format, defaulting to MP4:', url);
  return { type: 'mp4', mimeType: 'video/mp4', name: 'MP4' };
});

const proxyUrl = computed(() => {
  if (!sourceUrl.value) return "";
  let url = `https://nuxt4-stalker-portal.onrender.com/api/stream-proxy?url=${encodeURIComponent(sourceUrl.value)}`;

  if (providerType.value === 'stalker') {
    if (stalker.portalurl) url += `&portalurl=${encodeURIComponent(stalker.portalurl)}`;
    if (stalker.macaddress) url += `&macaddress=${encodeURIComponent(stalker.macaddress)}`;
    if (stalker.token) url += `&token=${encodeURIComponent(stalker.token)}`;
  } else if (providerType.value === 'xtream') {
    // Xtream usually doesn't need special headers for the stream itself beyond the URL
  }

 return url;
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
      // Pre-check stream status
      const response = await fetch(proxyUrl.value, { 
        method: 'GET', // Switch to GET with range for better compatibility
        headers: { 'Range': 'bytes=0-0' },
        signal: AbortSignal.timeout(8000)
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
    url: proxyUrl.value,
    format: streamFormat.value.type
  });

  // Check if this is a .ts stream that failed and we haven't tried .m3u8 fallback yet
  if (streamFormat.value.type === 'mpegts' && !hasTriedM3u8Fallback) {
    console.log('[VideoPlayer] .ts stream failed, trying .m3u8 fallback...');
    hasTriedM3u8Fallback = true;

    // Convert .ts URL to .m3u8 and retry
    const fallbackUrl = convertTsToM3u8(sourceUrl.value);

    toast.add({
      title: "Trying Alternative Format",
      description: "MPEG-TS failed, retrying as HLS...",
      color: "warning",
      timeout: 3000,
    });

    // Force update sourceUrl to trigger retry with .m3u8
    if (providerType.value === "stalker") {
      stalker.sourceUrl = fallbackUrl;
    } else if (providerType.value === "xtream") {
      xtream.sourceUrl = fallbackUrl;
    }

    isLoading.value = false;
    clearLoadingTimeout();
    return; // Exit early, watcher will trigger reload with new URL
  }

  // Show user-friendly error with retry option for temporary errors
  const isRetryableError = httpStatus && [429, 500, 502, 503, 504].includes(httpStatus);
  
  toast.add({
    title: httpStatus ? `Stream Error (${httpStatus})` : "Playback Error",
    description: errorMessage,
    color: "error",
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
          color: "warning",
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
      color: "error",
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

      const streamUrl = proxyUrl.value;
      console.log('[VideoPlayer] Loading source:', streamUrl);
      console.log('[VideoPlayer] Detected format:', streamFormat.value.name, '(' + streamFormat.value.type + ')', 'MIME:', streamFormat.value.mimeType);

      // Optional: Check if stream URL is accessible before loading
      try {
        const checkResponse = await fetch(streamUrl, {
          method: 'GET',
          headers: { 'Range': 'bytes=0-0' },
          signal: AbortSignal.timeout(8000)
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

      // Set new source with correct MIME type
      const newSource = document.createElement("source");
      newSource.src = streamUrl;
      newSource.type = streamFormat.value.mimeType;
      videoElement.value?.appendChild(newSource);

      player.source = {
        type: "video",
        sources: [
          {
            src: streamUrl,
            type: streamFormat.value.mimeType,
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
          color: "error",
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
          color: "warning",
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
        color: "error",
        timeout: 0,
      });
    }
  }

  // Setup watcher
  stopWatcher = watch(sourceUrl, async (newUrl, oldUrl) => {
    if (!isComponentMounted.value || newUrl === oldUrl || !newUrl) return;

    setLoadingWithTimeout(60000); // 60 seconds for IPTV streams
    retryCount = 0;

    // Reset fallback flag when source changes (but not if it's the fallback itself)
    if (!newUrl.includes('.m3u8') || !oldUrl.includes('.ts')) {
      hasTriedM3u8Fallback = false;
    }

    if (player && videoElement.value) {
      await loadSource(newUrl);
    }
  });

  // Start time update interval
  timeUpdateInterval = setInterval(() => {
    currentTime.value = Date.now();
  }, 30000); // Every 30 seconds

  // Fetch initial EPG for the current channel
  if (currentChannel.value) {
    const id = providerType.value === "stalker"
      ? currentChannel.value.id
      : currentChannel.value.stream_id;

    if (providerType.value === "stalker") {
      stalker.getEPG(Number(id));
    } else {
      xtream.getEPG(Number(id));
    }
  }
});

onUnmounted(() => {
  console.log('[VideoPlayer] Cleaning up component...');
  isComponentMounted.value = false;

  // Stop timer
  if (timeUpdateInterval) {
    clearInterval(timeUpdateInterval);
  }

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