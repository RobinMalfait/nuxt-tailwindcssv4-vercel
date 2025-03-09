<script setup lang="ts">
defineProps<{
  name: string
}>()
</script>

<template>
  <div class="text-center">
    <div class="flex justify-center relative mb-1">
      <div class="relative bg-warning rounded-full p-3">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60 text-white">
          <Icon name="material-symbols:construction" class="!size-16 animate-ping origin-center" aria-hidden="true" />
        </div>
        <Icon name="material-symbols:construction" class="!size-20 text-white block" aria-hidden="true" />
      </div>
    </div>
    <span class="font-bold text-primary">{{ name }}</span> is under construction
  </div>
</template>
