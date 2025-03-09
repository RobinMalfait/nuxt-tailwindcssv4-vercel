<template>
  <div class="sm:flex sm:flex-row-reverse">
    <div class="w-full sm:w-auto flex gap-x-4 items-center">
      <slot name="extraAction"></slot>
      <CtaButton v-bind="buttonProps" :disabled="isPending" @click="doAction" type="submit">
        {{ buttonText || 'OK' }}
      </CtaButton>
    </div>
    <div class="sm:flex-grow w-full sm:w-auto">
      <CtaButton preset="white-outline" class="sm:w-auto mt-2 sm:mt-0" @click="emit('close')">Cancel</CtaButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import CtaButton from "~/components/Ui/CtaButton.vue";

type ModalActionFnReturnType = undefined|boolean|void

const props = defineProps<{
  action?: () => ModalActionFnReturnType|Promise<ModalActionFnReturnType>
  buttonText?: string
  buttonProps?: ComponentProps<typeof CtaButton>
}>()

const emit = defineEmits<{
  close: []
}>()

defineSlots<{
  extraAction(): void
}>()

const isPending = ref(false)

async function doAction() {
  if (!props.action) {
    emit('close')
    return
  }
  isPending.value = true
  try {
    const response = await props.action()
    if (response === false) {
      return
    }
    emit('close')
  } finally {
    isPending.value = false
  }
}

defineExpose({
  isPending
})
</script>
