<script setup lang="ts">
import {usePaperWizardsStore} from "~/stores/paperWizardsStore";

const { paper } = defineProps<{
  paper: PaperResource
}>()

definePageMeta({
  name: 'paper-default-wizard'
})

const paperWizardsStore = usePaperWizardsStore()

navigateTo({ name: paperWizardsStore.wizards[0][0].wizards[0].routeName })
</script>

<template>
  <UiPageLoadingSpinner v-if="paper" message="Redirecting you to a wizard..." />
</template>
