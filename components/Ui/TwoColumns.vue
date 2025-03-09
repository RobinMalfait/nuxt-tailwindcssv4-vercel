<template>
  <div class="gap-y-4 sm:gap-y-0 sm:flex sm:gap-x-6">
    <div class="flex-1">
      <slot name="left" />
    </div>
    <div class="flex-1">
      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
