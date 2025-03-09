<template>
  <div>
    <HomeHero />
    <HomeFeatures />
    <HomeContribute />
  </div>
</template>

<script lang="ts" setup>
import HomeFeatures from "~/components/Home/HomeFeatures.vue";
import HomeContribute from "~/components/Home/HomeContribute.vue";
import HomeHero from "~/components/Home/HomeHero.vue";

useHead({
})
definePageMeta({
  auth: false
})
</script>
