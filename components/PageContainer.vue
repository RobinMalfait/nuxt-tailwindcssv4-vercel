<template>
  <div class="mx-auto w-full">
    <div class="mx-auto px-4 sm:px-6 lg:px-8" :class="maxWidthClass" v-bind="$attrs">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  inheritAttrs: false
})

const props = defineProps<{
  size?: 'narrow'|'medium'|'default'
}>()

const maxWidthClass = computed(() => {
  if (props.size === 'narrow') {
    return 'max-w-3xl'
  }
  if (props.size === 'medium') {
    return 'max-w-5xl'
  }
  return 'max-w-7xl'
})
</script>
