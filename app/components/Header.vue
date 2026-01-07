<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/">
        <AppLogo class="w-auto h-6 shrink-0" />
      </NuxtLink>
    </template>

    <template #right>
      <UInput v-model="portalurl" placeholder="Portal URL" />
      <UInput v-model="macaddress" placeholder="MAC Address" />
      <UButton @click="makeHandshake">Make Handshake</UButton>
      <UColorModeButton />
    </template>
  </UHeader>
</template>

<script setup lang="ts">
const portalurl = ref("http://d4k4u.com/c/");
const macaddress = ref("00:1A:79:AC:51:80");
const token = ref("");

const stalkerStore = useStalkerStore();

function makeHandshake() {
  stalkerStore.makeHandshake(portalurl.value, macaddress.value);
  token.value = stalkerStore.token;
}
</script>
