<script setup lang="ts">
import PaperPreview from "~/components/Paper/PaperPreview.vue";

definePageMeta({
  name: 'preview'
})

defineProps<{
  paper: PaperResource
}>()

const pagePreview = ref()
const isLoadingPreview = computed(() => {
  const isLoading = pagePreview.value?.isLoading
  return isLoading === undefined ? true : isLoading
})

async function reloadPreview () {
  if (!pagePreview.value) return
  await pagePreview.value.reloadPaper()
}
</script>

<template>
  <PageSection>
    <PageContainer>
      <UiPageIntro title="Paper Preview" text="Here you can get a quick look at how your paper is coming along" />
      <div class="flex justify-end mt-4 mb-2">
        <div>
          <UiCtaButton preset="white-outline" @click="reloadPreview" :disabled="isLoadingPreview">
            Reload
            <Icon name="ph:arrow-clockwise" class="!size-5" />
          </UiCtaButton>
        </div>
      </div>
      <WhiteBox class="h-[600px] max-h-screen">
        <PaperPreview :paper-iri="paper['@id']" ref="pagePreview" />
      </WhiteBox>
    </PageContainer>
  </PageSection>
</template>
