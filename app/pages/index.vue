<template>
  <div class="flex flex-row h-screen justify-center items-center">
    <UContainer>
      <div class="flex flex-col m-auto max-w-1/2 gap-4">
        <h1
          class="text-2xl text-center font-bold text-red-800 text-shadow-black text-shadow-2xs"
        >
          STREAMFLIX LOGIN
        </h1>
        <UInput
          size="xl"
          placeholder="Enter your stalker portal url"
          v-model="portal"
        />
        <UInput size="xl" placeholder="Enter your mac address" v-model="mac" />
        <UButton
          leadingIcon="i-lucide-rocket"
          size="xl"
          color="primary"
          activeColor="success"
          variant="solid"
          autofocus
          loading-auto
          @click="checkMac"
          >Sign in to portal</UButton
        >
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { propsToString } from "@unhead/vue/server";

const stalker = useStalkerStore();
const portal = ref("");
const mac = ref("");
const toast = useToast();

async function checkMac() {
  let valid = await stalker.makeHandshake(portal.value, mac.value);

  if (valid?.success) {
    toast.add({
      title: "Crendtials are valid!",
      description: "Logging you in now",
    });

    let getinfo = await stalker.getAllInfo();

    navigateTo("/dashboard");
  } else {
    toast.add({
      title: "Crendtials are failed!",
      description: "Logging you failed please try different credentials",
    });
  }
}
</script>

<style scoped>
.video-holder {
  display: grid;
  width: 100%;
  margin-bottom: 20px;
  min-height: 400px;
  max-height: 60vh;
}
.items-holder {
  display: grid;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 400px;
  overflow-y: auto;
  max-height: 40vh;
}
</style>
