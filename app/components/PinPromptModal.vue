<template>
  <UModal v-model:open="isOpen" :close="!isLoading" size="sm">
    <template #content>
      <div class="bg-[#141414] p-6">
        <!-- Header -->
        <div class="mb-6 text-center">
          <div class="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <UIcon name="i-lucide-lock" class="w-8 h-8 text-red-600" />
          </div>
          <h2 class="text-2xl font-bold mb-2">Parental Control</h2>
          <p class="text-sm text-gray-400">
            This content is restricted. Enter your PIN to continue.
          </p>
        </div>

        <!-- PIN Input -->
        <div class="mb-4">
          <UInput
            ref="pinInputRef"
            v-model="pin"
            type="password"
            inputmode="numeric"
            size="xl"
            placeholder="Enter PIN"
            maxlength="6"
            block
            autofocus
            :disabled="isLoading || isOnCooldown"
            @keydown.enter="handleSubmit"
            @keydown.esc="handleCancel"
          />
          <p v-if="errorMessage" class="text-red-500 text-sm mt-2">
            {{ errorMessage }}
          </p>
          <p v-if="isOnCooldown" class="text-yellow-500 text-sm mt-2">
            Too many attempts. Please wait {{ cooldownRemaining }} seconds.
          </p>
        </div>

        <!-- Attempt Counter -->
        <div v-if="attempts > 0 && attempts < maxAttempts" class="mb-4 text-center">
          <p class="text-sm text-gray-400">
            Attempts remaining: {{ maxAttempts - attempts }}
          </p>
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
          <UButton
            color="gray"
            variant="ghost"
            block
            :disabled="isLoading"
            @click="handleCancel"
          >
            Cancel
          </UButton>
          <UButton
            color="red"
            block
            :loading="isLoading"
            :disabled="!pin || isOnCooldown"
            @click="handleSubmit"
          >
            Verify PIN
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'submit': [pin: string]
  'cancel': []
}>()

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
})

const pin = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const pinInputRef = ref<any>(null)

// Attempt limiting
const maxAttempts = 3
const attempts = ref(0)
const cooldownSeconds = 30
const isOnCooldown = ref(false)
const cooldownRemaining = ref(0)
let cooldownInterval: NodeJS.Timeout | null = null

function startCooldown() {
  isOnCooldown.value = true
  cooldownRemaining.value = cooldownSeconds

  cooldownInterval = setInterval(() => {
    cooldownRemaining.value--
    if (cooldownRemaining.value <= 0) {
      isOnCooldown.value = false
      attempts.value = 0
      if (cooldownInterval) {
        clearInterval(cooldownInterval)
        cooldownInterval = null
      }
    }
  }, 1000)
}

async function handleSubmit() {
  if (!pin.value || isLoading.value || isOnCooldown.value) return

  isLoading.value = true
  errorMessage.value = ''

  // Emit the PIN for verification
  emit('submit', pin.value)

  // Note: Parent component will handle verification and show error if needed
  // We just reset state here
  isLoading.value = false
}

function handleCancel() {
  if (isLoading.value) return
  emit('cancel')
  isOpen.value = false
}

function resetForm() {
  pin.value = ''
  errorMessage.value = ''
  isLoading.value = false
}

// Handle failed attempt (called from parent)
function handleFailedAttempt() {
  attempts.value++
  pin.value = ''

  if (attempts.value >= maxAttempts) {
    startCooldown()
  }
}

// Expose method for parent to call on failed attempt
defineExpose({
  handleFailedAttempt,
})

// Reset form when modal opens/closes
watch(isOpen, (value) => {
  if (value) {
    resetForm()
    // Focus input after modal opens
    nextTick(() => {
      pinInputRef.value?.input?.focus()
    })
  } else {
    // Clean up cooldown interval if modal closes
    if (cooldownInterval) {
      clearInterval(cooldownInterval)
      cooldownInterval = null
    }
  }
})

// Cleanup on unmount
onUnmounted(() => {
  if (cooldownInterval) {
    clearInterval(cooldownInterval)
  }
})
</script>
