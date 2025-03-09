<template>
  <div :class="classNames">
    <component :is="componentType" v-bind="componentType === 'button' ? { type: 'button' } : linkProps" :class="pointerElementClassNames">
      <div class="p-6 z-10 relative bg-inherit rounded-md">
        <slot />
      </div>
    </component>
    <slot name="footer" />
    <div v-if="hasWarning" class="absolute top-2 left-2 pointer-events-none">
      <UiStatus size="size-1.5" status="warning-outline" class="backface-hidden" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type {NuxtLinkProps} from "#app/components/nuxt-link";
import {NuxtLink} from "#components";

const { linkProps, hasWarning, isButton } = defineProps<{
  linkProps?: NuxtLinkProps
  hasWarning?: boolean
  isButton?: boolean
}>()

const isLink = computed(() => !!linkProps?.to)
const componentType = computed(() => {
  return isLink.value ? NuxtLink : (isButton ? 'button' : 'div')
})

const classNames = computed(() => {
  const baseClasses = ['relative', 'block', 'border', 'rounded-md', 'shadow-sm', 'max-w-full', 'transition', 'w-full']

  const customClassNames = []

  if (hasWarning) {
    customClassNames.push('border', 'border-warning')
  }

  return twMergeArrays(baseClasses, customClassNames)
})

const pointerElementClassNames = computed(() => {
  const baseClasses = ['relative', 'z-2', 'rounded-md', 'max-w-full', 'transition', 'text-left', 'w-full']
  const customClassNames = []
  if (componentType.value !== 'div') {
    customClassNames.push('hover:bg-primary/5', 'cursor-pointer')
  }
  return twMergeArrays(baseClasses, customClassNames)
})
</script>
