<script setup lang="ts">
import {FetchError} from "ofetch";

const { paperIri } = defineProps<{
  paperIri: PaperResource['@id']
}>()

const { $api } = useNuxtApp()
const loadingPreview = ref(false)
const loadingError = ref<string>()
const previewHtml = ref<string>()

async function reloadPaper () {
  loadingPreview.value = true
  loadingError.value = undefined
  previewHtml.value = undefined
  try {
    previewHtml.value = await $api<string>(`${paperIri}/preview`)
  } catch (error) {
    if (!(error instanceof FetchError)) {
      loadingError.value = String(error)
      throw error
    }
    loadingError.value = error.data
  }
  loadingPreview.value = false
}

defineExpose({
  reloadPaper,
  isLoading: loadingPreview
})

onMounted(() => {
  reloadPaper()
})
</script>

<template>
  <div class="h-full flex items-center justify-center">
    <UiPageLoadingSpinner v-if="loadingPreview" message="Loading preview" />
    <div v-else v-html="previewHtml" class="h-full overflow-auto" />
  </div>
</template>
