<template>
  <NuxtLink v-bind="props" v-slot="{ isActive }">
    <DisclosureButton as="span" :class="navItemClasses(isActive)">
      <slot />
    </DisclosureButton>
  </NuxtLink>
</template>

<script setup lang="ts">
import {DisclosureButton} from "@headlessui/vue";
import {type RouterLinkProps} from "#vue-router";

const props = defineProps<RouterLinkProps & {
  isCta?: boolean
}>()

const navItemClasses = (isActive: boolean) => {
  const baseClass = 'block border-l-4 py-2 pl-3 pr-4 text-base font-bold'
  const baseTextColor = props.isCta ? 'text-primary' : 'text-gray-500'
  const baseTextHoverColor = props.isCta ? 'hover:text-primary' : 'hover:text-gray-700'
  if (isActive) {
    return `${baseClass} bg-primary/5 border-primary text-primary`
  }
  return `${baseClass} border-transparent ${baseTextColor} hover:border-primary/50 hover:bg-gray-50 ${baseTextHoverColor}`
}
</script>
