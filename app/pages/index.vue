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

        <!-- Remember Me -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UCheckbox v-model="rememberMe" />
            <label class="text-sm text-gray-400 cursor-pointer" @click="rememberMe = !rememberMe">
              Remember me
            </label>
          </div>
          
          <!-- Pre-filled Indicator -->
          <div 
            v-if="credentialsPrefilled"
            class="flex items-center gap-1 text-xs text-blue-400"
          >
            <UIcon name="i-lucide-check-circle" class="w-4 h-4" />
            <span>Credentials loaded</span>
          </div>
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
const auth = useAuth();
const toast = useToast();

// Provider type selection
const providerType = ref<"stalker" | "xtream">("stalker");

// Stalker credentials
const stalkerPortal = ref("");
const stalkerMac = ref("");

// Xtream credentials
const xtreaminputUrl = ref("");
const xtreamUrl = ref("");
const xtreamUsername = ref("");
const xtreamPassword = ref("");

// Remember me checkbox
const rememberMe = ref(false);
const credentialsPrefilled = ref(false);

// Get loading state from auth composable
const isLoading = computed(() => auth.isLoading.value);

// Initialize auth on mount
onMounted(async () => {
  await auth.init();
  rememberMe.value = auth.rememberMe.value;
  
  // If already authenticated, redirect to dashboard
  if (auth.isAuthenticated.value) {
    navigateTo("/dashboard");
    return;
  }

  // Load and pre-fill stored credentials (no auto-login)
  const stored = await auth.loadStoredCredentials();
  if (stored) {
    if (stored.providerType === 'stalker') {
      providerType.value = 'stalker';
      stalkerPortal.value = stored.credentials.portalUrl || '';
      stalkerMac.value = stored.credentials.macAddress || '';
    } else if (stored.providerType === 'xtream') {
      providerType.value = 'xtream';
      xtreamUrl.value = stored.credentials.serverUrl || '';
      xtreamUsername.value = stored.credentials.username || '';
      xtreamPassword.value = stored.credentials.password || '';
    }
    
    credentialsPrefilled.value = true;
    console.log('[Auth] Credentials pre-filled from storage');
    
    // Show notification
    toast.add({
      title: 'Credentials Loaded',
      description: 'Your saved credentials have been pre-filled. Review and sign in.',
      color: 'blue',
      timeout: 4000,
    });
  }
});

async function handleLogin() {
  try {
    let success = false;
    
    if (providerType.value === "stalker") {
      success = await auth.loginStalker(
        stalkerPortal.value,
        stalkerMac.value,
        rememberMe.value
      );
    } else {
      success = await auth.loginXtream(
        xtreamUrl.value,
        xtreamUsername.value,
        xtreamPassword.value,
        rememberMe.value
      );
    }

    if (success) {
      navigateTo("/dashboard");
    }
  } catch (error: any) {
    console.error("Login error:", error);
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
    return false;
  }

  return await auth.loginStalker(
    stalkerPortal.value,
    stalkerMac.value,
    rememberMe.value
  );
}

async function loginXtream() {
  if (!xtreamUrl.value || !xtreamUsername.value || !xtreamPassword.value) {
    toast.add({
      title: "Missing Information",
      description: "Please fill in all fields",
      color: "red",
    });
    return false;
  }

  return await auth.loginXtream(
    xtreamUrl.value,
    xtreamUsername.value,
    xtreamPassword.value,
    rememberMe.value
  );
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
