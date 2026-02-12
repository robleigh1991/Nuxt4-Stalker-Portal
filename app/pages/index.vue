<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black overflow-hidden">
    <!-- Background Image -->
    <div class="absolute inset-0 z-0 opacity-50">
      <NuxtImg 
        src="https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=2069&auto=format&fit=crop"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black"></div>
    </div>

    <!-- Login Card -->
    <div class="relative z-10 w-full max-w-[450px] p-8 md:p-16 bg-black/80 rounded-md border border-white/10 shadow-2xl backdrop-blur-sm">
      <div class="mb-10 text-center">
        <h1 class="text-4xl font-extrabold text-red-600 tracking-tighter uppercase">Streamflix</h1>
      </div>

      <h2 class="text-3xl font-bold text-white mb-8">Sign In</h2>

      <!-- Provider Selector Tabs -->
      <div class="flex border-b border-gray-700 mb-8">
        <button 
          @click="providerType = 'stalker'"
          class="flex-1 py-4 text-sm font-bold uppercase transition-colors"
          :class="providerType === 'stalker' ? 'text-white border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-300'"
        >
          Stalker
        </button>
        <button 
          @click="providerType = 'xtream'"
          class="flex-1 py-4 text-sm font-bold uppercase transition-colors"
          :class="providerType === 'xtream' ? 'text-white border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-300'"
        >
          Xtream
        </button>
      </div>

      <div class="space-y-6">
        <!-- Stalker Fields -->
        <div v-if="providerType === 'stalker'" class="space-y-4">
          <div class="group">
            <input 
              v-model="stalkerPortal"
              type="text"
              placeholder="Portal URL"
              class="w-full h-14 px-5 bg-[#333] text-white rounded focus:bg-[#454545] focus:outline-none border-b-2 border-transparent focus:border-[#e87c03] transition-all placeholder-gray-500"
            />
          </div>
          <div class="group">
            <input 
              v-model="stalkerMac"
              type="text"
              placeholder="MAC Address"
              class="w-full h-14 px-5 bg-[#333] text-white rounded focus:bg-[#454545] focus:outline-none border-b-2 border-transparent focus:border-[#e87c03] transition-all placeholder-gray-500"
            />
          </div>
        </div>

        <!-- Xtream Fields -->
        <div v-else class="space-y-4">
          <input 
            v-model="xtreamUrl"
            type="text"
            placeholder="Server URL"
            class="w-full h-14 px-5 bg-[#333] text-white rounded focus:bg-[#454545] focus:outline-none border-b-2 border-transparent focus:border-[#e87c03] transition-all placeholder-gray-500"
          />
          <input 
            v-model="xtreamUsername"
            type="text"
            placeholder="Username"
            class="w-full h-14 px-5 bg-[#333] text-white rounded focus:bg-[#454545] focus:outline-none border-b-2 border-transparent focus:border-[#e87c03] transition-all placeholder-gray-500"
          />
          <input 
            v-model="xtreamPassword"
            type="password"
            placeholder="Password"
            class="w-full h-14 px-5 bg-[#333] text-white rounded focus:bg-[#454545] focus:outline-none border-b-2 border-transparent focus:border-[#e87c03] transition-all placeholder-gray-500"
          />
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <input 
              type="checkbox" 
              v-model="rememberMe" 
              class="w-4 h-4 rounded bg-[#333] border-none text-red-600 focus:ring-0"
            />
            <span class="text-sm text-gray-400">Remember Me</span>
          </div>
        </div>

        <button 
          @click="handleLogin"
          :disabled="isLoading"
          class="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <UIcon v-if="isLoading" name="i-lucide-loader-2" class="animate-spin" />
          {{ isLoading ? 'Connecting...' : 'Sign In' }}
        </button>

        <div class="pt-4 text-center">
          <p v-if="credentialsPrefilled" class="text-green-500 text-sm flex items-center justify-center gap-2">
            <UIcon name="i-lucide-check-circle" /> Saved credentials loaded
          </p>
        </div>
      </div>
    </div>
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
      color: "success",
    });
  }
});

async function loginStalker() {
  if (!stalkerPortal.value || !stalkerMac.value) {
    toast.add({
      title: "Missing Information",
      description: "Please enter both portal URL and MAC address",
      color: "error",
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
      color: "error",
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
