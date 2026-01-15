<template>
  <div
    class="flex flex-row h-screen justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-black"
  >
    <UContainer>
      <div
        class="flex flex-col m-auto max-w-xl gap-6 p-8 bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-700 shadow-2xl"
      >
        <h1
          class="text-3xl text-center font-bold text-red-500 text-shadow-black text-shadow-2xs mb-4"
        >
          STREAMFLIX LOGIN
        </h1>

        <!-- Provider Type Selector -->
        <div class="flex gap-2 p-1 bg-gray-800 rounded-lg">
          <button
            @click="providerType = 'stalker'"
            :class="[
              'flex-1 py-3 px-4 rounded-md font-semibold transition-all duration-200',
              providerType === 'stalker'
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-transparent text-gray-400 hover:text-white',
            ]"
          >
            <span class="flex items-center justify-center gap-2">
              <UIcon name="i-lucide-tv" class="w-5 h-5" />
              Stalker Portal
            </span>
          </button>
          <button
            @click="providerType = 'xtream'"
            :class="[
              'flex-1 py-3 px-4 rounded-md font-semibold transition-all duration-200',
              providerType === 'xtream'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-transparent text-gray-400 hover:text-white',
            ]"
          >
            <span class="flex items-center justify-center gap-2">
              <UIcon name="i-lucide-play-circle" class="w-5 h-5" />
              Xtream Codes
            </span>
          </button>
        </div>

        <!-- Stalker Portal Form -->
        <div v-if="providerType === 'stalker'" class="flex flex-col gap-4">
          <UInput
            size="xl"
            placeholder="Portal URL (e.g., http://server.com/c)"
            v-model="stalkerPortal"
            icon="i-lucide-link"
          />
          <UInput
            size="xl"
            placeholder="MAC Address (e.g., 00:1A:79:14:DF:0A)"
            v-model="stalkerMac"
            icon="i-lucide-network"
          />
        </div>

        <!-- Xtream Codes Form -->
        <div v-if="providerType === 'xtream'" class="flex flex-col gap-4">
          <UInput
            size="xl"
            placeholder="Enter M3U url"
            v-model="xtreaminputUrl"
            icon="i-lucide-server"
          />
          <UInput
            size="xl"
            placeholder="Server URL (e.g., http://server.com:8080)"
            v-model="xtreamUrl"
            icon="i-lucide-server"
          />
          <UInput
            size="xl"
            placeholder="Username"
            v-model="xtreamUsername"
            icon="i-lucide-user"
          />
          <UInput
            size="xl"
            placeholder="Password"
            v-model="xtreamPassword"
            type="password"
            icon="i-lucide-lock"
          />
        </div>

        <!-- Login Button -->
        <UButton
          :leadingIcon="
            providerType === 'stalker' ? 'i-lucide-tv' : 'i-lucide-play-circle'
          "
          size="xl"
          :color="providerType === 'stalker' ? 'red' : 'blue'"
          variant="solid"
          :loading="isLoading"
          @click="handleLogin"
          class="mt-2"
        >
          {{
            isLoading
              ? "Connecting..."
              : `Sign in with ${
                  providerType === "stalker" ? "Stalker" : "Xtream"
                }`
          }}
        </UButton>

        <!-- Provider Info -->
        <div class="text-center text-sm text-gray-400 mt-2">
          <p v-if="providerType === 'stalker'">
            Connect using your Stalker Portal credentials
          </p>
          <p v-else>Connect using your Xtream Codes credentials</p>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
const stalker = useStalkerStore();
const xtream = useXtreamStore();
const toast = useToast();

// Provider type selection
const providerType = ref<"stalker" | "xtream">("stalker");
const isLoading = ref(false);

// Stalker credentials
const stalkerPortal = ref("c");
const stalkerMac = ref("");

// Xtream credentials
const xtreaminputUrl = ref("");
const xtreamUrl = ref("");
const xtreamUsername = ref("");
const xtreamPassword = ref("");

async function handleLogin() {
  isLoading.value = true;

  try {
    if (providerType.value === "stalker") {
      await loginStalker();
    } else {
      await loginXtream();
    }
  } catch (error: any) {
    console.error("Login error:", error);
    toast.add({
      title: "Login Failed",
      description:
        error.message || "Please check your credentials and try again",
      color: "red",
    });
  } finally {
    isLoading.value = false;
  }
}

// --------------------
// XTREAM URL PARSER
// --------------------
function parseXtreamUrl(input: string) {
  try {
    const url = new URL(input);

    // Always preserve protocol + host (+ port if any)
    const baseUrl = `${url.protocol}//${url.host}`;

    // 1️⃣ Query-based (player_api.php / get.php)
    const username = url.searchParams.get("username");
    const password = url.searchParams.get("password");

    if (username && password) {
      xtreamUsername.value = username;
      xtreamPassword.value = password;
      xtreamUrl.value = baseUrl;
      return true;
    }

    // 2️⃣ Path-based (/username/password/)
    const parts = url.pathname.split("/").filter(Boolean);

    if (parts.length >= 2) {
      const u = parts[0];
      const p = parts[1];

      if (u && p) {
        xtreamUsername.value = u;
        xtreamPassword.value = p;
        xtreamUrl.value = baseUrl;
        return true;
      }
    }
  } catch {
    // Invalid URL → ignore
  }

  return false;
}

// --------------------
// WATCH XTREAM INPUT
// --------------------
watch(xtreaminputUrl, (val) => {
  const extracted = parseXtreamUrl(val);

  if (extracted) {
    toast.add({
      title: "Xtream URL detected",
      description: "Username and password extracted automatically",
      color: "green",
    });
  }
});

async function loginStalker() {
  if (!stalkerPortal.value || !stalkerMac.value) {
    toast.add({
      title: "Missing Information",
      description: "Please enter both portal URL and MAC address",
      color: "red",
    });
    return;
  }

  const valid = await stalker.makeHandshake(
    stalkerPortal.value,
    stalkerMac.value
  );

  if (valid?.success) {
    toast.add({
      title: "Credentials Valid!",
      description: "Loading your content...",
      color: "green",
    });

    await stalker.getAllInfo();
    navigateTo("/dashboard");
  } else {
    throw new Error("Invalid Stalker credentials");
  }
}

async function loginXtream() {
  if (!xtreamUrl.value || !xtreamUsername.value || !xtreamPassword.value) {
    toast.add({
      title: "Missing Information",
      description: "Please fill in all fields",
      color: "red",
    });
    return;
  }

  const valid = await xtream.authenticate(
    xtreamUrl.value,
    xtreamUsername.value,
    xtreamPassword.value
  );

  if (valid?.success) {
    toast.add({
      title: "Credentials Valid!",
      description: "Loading your content...",
      color: "green",
    });

    // Load initial data
    await Promise.all([
      xtream.getLiveCategories(),
      xtream.getVodCategories(),
      xtream.getSeriesCategories(),
    ]);

    navigateTo("/dashboard");
  } else {
    throw new Error("Invalid Xtream credentials");
  }
}
</script>

<style scoped>
.text-shadow-black {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.text-shadow-2xs {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}
</style>
