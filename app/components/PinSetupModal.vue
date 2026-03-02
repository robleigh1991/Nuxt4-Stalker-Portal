<template>
  <UModal v-model:open="isOpen" :close="!isLoading" size="sm">
    <template #content>
      <div class="bg-[#141414] p-6">
        <!-- Header -->
        <div class="mb-6 text-center">
          <div class="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <UIcon name="i-lucide-shield-check" class="w-8 h-8 text-blue-600" />
          </div>
          <h2 class="text-2xl font-bold mb-2">
            {{ mode === 'create' ? 'Set Up PIN' : 'Change PIN' }}
          </h2>
          <p class="text-sm text-gray-400">
            {{ mode === 'create'
              ? 'Create a 4-6 digit PIN to protect adult content'
              : 'Enter your current PIN and create a new one'
            }}
          </p>
        </div>

        <!-- Current PIN (for change mode) -->
        <div v-if="mode === 'change'" class="mb-4">
          <label class="block text-sm font-medium mb-2">Current PIN</label>
          <UInput
            ref="currentPinRef"
            v-model="currentPin"
            type="password"
            inputmode="numeric"
            size="lg"
            placeholder="Enter current PIN"
            maxlength="6"
            block
            autofocus
            :disabled="isLoading"
            @keydown.enter="focusNext('newPinRef')"
          />
        </div>

        <!-- New PIN -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">
            {{ mode === 'create' ? 'PIN' : 'New PIN' }}
          </label>
          <UInput
            ref="newPinRef"
            v-model="newPin"
            type="password"
            inputmode="numeric"
            size="lg"
            placeholder="Enter 4-6 digit PIN"
            maxlength="6"
            block
            :autofocus="mode === 'create'"
            :disabled="isLoading"
            @keydown.enter="focusNext('confirmPinRef')"
          />
        </div>

        <!-- Confirm PIN -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Confirm PIN</label>
          <UInput
            ref="confirmPinRef"
            v-model="confirmPin"
            type="password"
            inputmode="numeric"
            size="lg"
            placeholder="Re-enter PIN"
            maxlength="6"
            block
            :disabled="isLoading"
            @keydown.enter="handleSubmit"
          />
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded">
          <p class="text-red-500 text-sm">{{ errorMessage }}</p>
        </div>

        <!-- PIN Requirements -->
        <div class="mb-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded">
          <p class="text-blue-400 text-xs">
            <UIcon name="i-lucide-info" class="w-3 h-3 inline mr-1" />
            PIN must be 4-6 digits
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
            color="primary"
            block
            :loading="isLoading"
            :disabled="!isFormValid"
            @click="handleSubmit"
          >
            {{ mode === 'create' ? 'Set PIN' : 'Change PIN' }}
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  open: boolean
  mode: 'create' | 'change'
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'success': [pin: string]
  'cancel': []
}>()

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
})

const settings = useSettingsStore()
const toast = useToast()

const currentPin = ref('')
const newPin = ref('')
const confirmPin = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const currentPinRef = ref<any>(null)
const newPinRef = ref<any>(null)
const confirmPinRef = ref<any>(null)

const isFormValid = computed(() => {
  if (props.mode === 'change' && !currentPin.value) return false
  if (!newPin.value || !confirmPin.value) return false
  return newPin.value.length >= 4 && newPin.value.length <= 6
})

function focusNext(refName: string) {
  const refs: any = {
    newPinRef: newPinRef.value,
    confirmPinRef: confirmPinRef.value,
  }
  refs[refName]?.input?.focus()
}

function validatePin(pin: string): boolean {
  // Must be 4-6 digits
  if (pin.length < 4 || pin.length > 6) {
    errorMessage.value = 'PIN must be 4-6 digits'
    return false
  }

  // Must be numeric
  if (!/^\d+$/.test(pin)) {
    errorMessage.value = 'PIN must contain only numbers'
    return false
  }

  return true
}

async function handleSubmit() {
  if (!isFormValid.value || isLoading.value) return

  errorMessage.value = ''
  isLoading.value = true

  try {
    // Validate new PIN format
    if (!validatePin(newPin.value)) {
      isLoading.value = false
      return
    }

    // Check if PINs match
    if (newPin.value !== confirmPin.value) {
      errorMessage.value = 'PINs do not match'
      isLoading.value = false
      return
    }

    // For change mode, verify current PIN first
    if (props.mode === 'change') {
      const valid = await settings.verifyPin(currentPin.value)
      if (!valid) {
        errorMessage.value = 'Current PIN is incorrect'
        isLoading.value = false
        return
      }
    }

    // Set the new PIN
    await settings.setPin(newPin.value)

    toast.add({
      title: 'Success',
      description: props.mode === 'create'
        ? 'Parental control PIN has been set'
        : 'PIN has been changed successfully',
      color: 'green',
    })

    emit('success', newPin.value)
    isOpen.value = false
  } catch (error) {
    console.error('PIN setup error:', error)
    errorMessage.value = 'An error occurred. Please try again.'
  } finally {
    isLoading.value = false
  }
}

function handleCancel() {
  if (isLoading.value) return
  emit('cancel')
  isOpen.value = false
}

function resetForm() {
  currentPin.value = ''
  newPin.value = ''
  confirmPin.value = ''
  errorMessage.value = ''
  isLoading.value = false
}

// Reset form when modal opens/closes
watch(isOpen, (value) => {
  if (value) {
    resetForm()
    // Focus appropriate input after modal opens
    nextTick(() => {
      if (props.mode === 'change') {
        currentPinRef.value?.input?.focus()
      } else {
        newPinRef.value?.input?.focus()
      }
    })
  }
})
</script>
