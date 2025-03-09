<template>
  <UiModal
    quick-close
    :open="open"
    @close="emit('close')"
    :title="title"
    :action-props="{
      action: doAction,
      buttonProps: {
        preset: 'danger'
      },
      buttonText
    }"
  >
    <template #icon>
      <Icon name="heroicons:exclamation-triangle" class="!size-6 text-danger" aria-hidden="true" />
    </template>
    <slot />
  </UiModal>
</template>

<script setup lang="ts">
const performingAction = ref(false)

const emit = defineEmits<{
  close: []
}>()

const props = defineProps<{
  open: boolean
  title: string
  buttonText: string
  action: () => void|false|Promise<void|false>
}>()

async function doAction () {
  performingAction.value = true
  try {
    const result = await props.action()
    result !== false && emit('close')
  } finally {
    performingAction.value = false
  }
}
</script>
