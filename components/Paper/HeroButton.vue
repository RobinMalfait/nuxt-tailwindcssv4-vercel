<script setup lang="ts">
import type {NuxtLinkProps} from "#app/components/nuxt-link";
import {twMerge} from "tailwind-merge";

const { size = 'size-5' } = defineProps<{
  iconName: string
  label: string
  size?: `size-${number}`
  linkProps: NuxtLinkProps
}>()

</script>

<template>
  <NuxtLink
    v-bind="linkProps"
    :class="twMerge('transition-all h-8 ease-linear px-2 py-0.5 flex gap-x-1 opacity-100 border border-black/0 bg-black/0 hover:bg-black/20 items-center duration-250 rounded-md outline outline-2 outline-primary/0 -outline-offset-8 hover:outline-offset-1 hover:outline-white/90 hover:outline-1 hover:border-white/40 hover:opacity-100 last:mr-1', $attrs.class as string || '')"
    active-class="!bg-black/50 hover:!bg-black/60 !opacity-100"
  >
    <Icon :name="iconName" class="block" :class="`!${size}`"/>
    {{ label }}
  </NuxtLink>
</template>
