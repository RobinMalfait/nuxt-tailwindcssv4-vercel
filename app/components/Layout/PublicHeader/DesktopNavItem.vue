<template>
  <NuxtLink v-bind="props" v-slot="{ isActive }">
    <span :class="navItemClasses(isActive)">
      <slot />
    </span>
  </NuxtLink>
</template>

<script lang="ts" setup>
import {type RouterLinkProps} from "#vue-router";

const props = defineProps<RouterLinkProps & {
  isCta?: boolean
}>()
const navItemClasses = (isActive: boolean) => {
  const baseClass = 'inline-flex items-center px-4 py-2 text-md font-medium rounded-md transition'
  if (props.isCta) {
    if (isActive) {
      return `${baseClass} bg-blue-600 text-white`
    }
    return `${baseClass} bg-primary text-white hover:bg-blue-600`
  }
  if (isActive) {
    return `${baseClass} text-primary bg-primary/5 hover:bg-primary/10`
  }
  return `${baseClass} text-gray-500 hover:bg-primary/10 hover:text-primary`
}
</script>
