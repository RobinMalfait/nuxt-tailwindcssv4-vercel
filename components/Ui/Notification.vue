<template>
  <div class="py-3 px-4 rounded-lg w-full shadow-sm outline outline-2 outline-offset-1 border border-opacity-30 flex flex-col gap-y-4 md:flex-row md:gap-x-3 md:gap-y-0 md:items-center" :class="styleClasses">
    <div v-if="iconName && hideIcon !== true">
      <Icon :name="iconName" class="!size-7 block"/>
    </div>
    <div class="flex-grow min-w-0">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  type?: 'message'|'info'|'error'|'warning'|'none'
  hideIcon?: boolean
}>()

const iconName = computed(() => {
  if (props.type === 'error') {
    return 'heroicons:exclamation-triangle'
  }
  if (props.type === 'warning') {
    return 'heroicons:exclamation-circle'
  }
  if (props.type === 'info') {
    return 'heroicons:information-circle'
  }
})

const styleClasses = computed(() => {
  if (props.type === 'none') {
    return
  }
  if (props.type === 'info') {
    return 'bg-primary/5 text-primary border-primary outline-primary'
  }
  if (props.type === 'error') {
    return 'bg-danger/5 text-danger border-danger outline-danger'
  }
  if (props.type === 'warning') {
    return 'bg-warning/5 text-yellow-800 border-warning outline-warning'
  }

 return 'bg-gray-100 text-gray-800'
})
</script>
