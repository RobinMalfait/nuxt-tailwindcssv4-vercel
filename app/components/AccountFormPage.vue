<template>
  <div class="flex min-h-full flex-1 flex-col justify-center py-12 px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-2xl/9 font-bold tracking-tight text-primary">{{ title }}</h2>
    </div>

    <div class="mt-5 sm:mx-auto sm:w-full" :class="[isWide ? 'sm:max-w-[680px]' : 'sm:max-w-[480px]']">
      <WhiteBox>
        <div v-if="requestError" class="p-2 rounded-md bg-danger/5 ring-1 ring-danger text-danger font-bold mb-4 shadow-md">
          {{ requestError }}
        </div>
        <slot />
      </WhiteBox>
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import WhiteBox from "~/components/WhiteBox.vue";

defineProps<{ title: string, requestError?: string, isWide?: boolean }>()
</script>
