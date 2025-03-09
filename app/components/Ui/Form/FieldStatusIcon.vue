<template>
  <div v-if="status" role="status" class="absolute top-1/2 right-2.5 -translate-y-1/2">
    <FadeScaleTransition mode="out-in">
      <Icon name="heroicons:exclamation-triangle" v-if="status === 'error'" class="text-danger !size-6 block"/>
      <Icon name="heroicons:check-circle" v-else-if="status === 'success'" class="text-success !size-6 block"/>
      <div v-else-if="status === 'loading'">
        <svg  class="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </FadeScaleTransition>
    <span v-if="status" class="sr-only">status: {{ status }}</span>
  </div>
</template>

<script setup lang="ts">
import FadeScaleTransition from "~/components/FadeScaleTransition.vue";

export type FieldInputStatus = 'loading' | 'success' | 'error' | 'invalid'

defineProps<{
  status?: FieldInputStatus
}>()
</script>
