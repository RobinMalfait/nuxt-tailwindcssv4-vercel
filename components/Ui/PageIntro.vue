<script setup lang="ts">
defineProps<{
  title: string
  text?: string
}>()
</script>

<template>
  <div class="prose max-w-none">
    <h1 class="text-xl md:text-3xl font-bold text-primary">{{ title }}</h1>
    <h4 v-if="text" class="text-gray-600">{{ text }}</h4>
    <slot />
  </div>
</template>
