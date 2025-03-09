<script setup lang="ts">
const { status, size = 'size-2' } = defineProps<{
  status: 'warning'|'error'|'success'|'warning-outline'|'unset',
  statusText?: string
  size?: `size-${number}`
}>()

const statusClass = computed(() => {
  if(status === 'warning') {
    return 'bg-warning outline-none scale-[1.7]'
  }
  if(status === 'warning-outline') {
    return 'bg-warning outline-warning outline-1'
  }
  if(status === 'error') {
    return 'bg-danger outline-danger outline-1'
  }
  if(status === 'unset') {
    return 'bg-gray-400 outline-gray-400 outline-1'
  }
  return 'bg-success outline-success outline-1'
})
</script>

<template>
  <span class="transition-all rounded-full outline outline-offset-2 origin-center block" :class="[statusClass, size]">
    <span v-if="statusText" class="sr-only">status: {{ statusText }}</span>
  </span>
</template>
