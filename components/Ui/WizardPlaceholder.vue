<script setup lang="ts">
import {usePaperWizardsStore} from "~/stores/paperWizardsStore";

const route = useRoute()
const paperWizardsStore = usePaperWizardsStore()

const ucName = computed(() => {
  return `'${paperWizardsStore.currentWizard?.name || route.name}' wizard`
})
</script>

<template>
  <UiUnderConstruction :name="ucName" />
</template>
