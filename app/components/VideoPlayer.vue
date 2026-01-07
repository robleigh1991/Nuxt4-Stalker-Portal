<template>
  <div class="video-section flex-1 flex flex-col relative overflow-hidden">
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
            :src="sourceUrl"
            type="application/x-mpegURL"
          />
        </video>
      </div>
    </div>

    <!-- Channel Info Bar -->
    <div
      v-if="selectedTab === 'live-tv'"
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
const sourceUrl = computed(() => stalker.sourceUrl);
const currentChannel = computed(() => stalker.currentChannel);
const videoElement = ref<HTMLVideoElement | null>(null);
let player: any = null;

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
  ],
};

onMounted(async () => {
  if (process.client && videoElement.value) {
    try {
      const PlyrModule = await import("plyr");
      const Plyr = PlyrModule.default || PlyrModule;
      player = new Plyr(videoElement.value, options);

      player.on("error", (event: any) => {
        const errorCode = event.detail.plyr.code;
        console.error(`Playback error: ${errorCode}`);
      });

      player.on("ready", () => {
        console.log("Plyr player is ready");
      });

      player.on("loadstart", () => {
        console.log("Plyr started loading source");
      });
    } catch (error) {
      console.error("Failed to load Plyr:", error);
    }
  }
});

onUnmounted(() => {
  if (player) {
    player.destroy();
    player = null;
  }
});

// Watch for sourceUrl changes and update Plyr
watch(
  () => stalker.sourceUrl,
  async (newUrl, oldUrl) => {
    if (newUrl === oldUrl || !newUrl) return;

    if (player && newUrl && videoElement.value) {
      try {
        const wasPlaying = !player.paused;

        if (wasPlaying) {
          player.pause();
        }

        const playPromise = new Promise<void>((resolve, reject) => {
          const onCanPlay = () => {
            videoElement.value?.removeEventListener("canplay", onCanPlay);
            videoElement.value?.removeEventListener("error", onError);
            resolve();
          };

          const onError = (e: Event) => {
            videoElement.value?.removeEventListener("canplay", onCanPlay);
            videoElement.value?.removeEventListener("error", onError);
            reject(e);
          };

          videoElement.value.addEventListener("canplay", onCanPlay, {
            once: true,
          });
          videoElement.value.addEventListener("error", onError, { once: true });
        });

        const existingSources = videoElement.value.querySelectorAll("source");
        existingSources.forEach((src) => src.remove());

        videoElement.value.removeAttribute("src");

        const newSource = document.createElement("source");
        newSource.src = newUrl;
        newSource.type = "application/x-mpegURL";
        videoElement.value.appendChild(newSource);

        player.source = {
          type: "video",
          sources: [
            {
              src: newUrl,
              type: "application/x-mpegURL",
            },
          ],
        };

        await nextTick();
        videoElement.value.load();

        try {
          await Promise.race([
            playPromise,
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Timeout")), 5000)
            ),
          ]);

          if (wasPlaying && stalker.modalOpen) {
            await player.play();
          }
        } catch (err: any) {
          console.error("Error loading new source:", err);
          if (wasPlaying && stalker.modalOpen) {
            setTimeout(() => {
              player.play().catch((e: any) => {
                console.error("Retry play failed:", e);
              });
            }, 500);
          }
        }

        if (!stalker.modalOpen) {
          stalker.modalOpen = true;
        }
      } catch (error) {
        console.error("Error updating video source:", error);
      }
    } else if (newUrl && !player && videoElement.value) {
      const existingSources = videoElement.value.querySelectorAll("source");
      existingSources.forEach((src) => src.remove());

      const newSource = document.createElement("source");
      newSource.src = newUrl;
      newSource.type = "application/x-mpegURL";
      videoElement.value.appendChild(newSource);
      videoElement.value.load();
    }
  }
);
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
