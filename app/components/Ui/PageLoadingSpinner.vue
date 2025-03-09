<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

<template>
  <div class="flex justify-center">
    <div class="text-center">
      <div class="flex justify-center mb-1">
        <UiSpinner class="size-8 text-primary"/>
      </div>
      <p class="text-gray-600 animate-pulse">{{ message }}</p>
    </div>
  </div>
</template>
