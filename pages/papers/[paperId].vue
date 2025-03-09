<script setup lang="ts">
import HeroButton from "~/components/Paper/HeroButton.vue";
import WizardSelector from "~/components/Paper/WizardSelector.vue";
import {usePaperWizardsStore} from "~/stores/paperWizardsStore";

const { params: { paperId } } = useRoute()
const { $api } = useNuxtApp()

const paperResource = ref<PaperResource>()
const paperWizardsStore = usePaperWizardsStore()
const paperValidationStore = usePaperValidationStore()

onMounted(async () => {
  paperResource.value = await $api<PaperResource>(`/account/papers/${paperId}`)
  if (paperResource.value) {
    paperWizardsStore.setWizardsByPaperStudyType(paperResource.value.studyType)
    await paperValidationStore.refreshPaperValidation(paperResource.value['@id'])
  }
})

definePageMeta({
  name: 'paper'
})
</script>

<template>
  <div>
    <section class="bg-blue-500 text-white">
      <PageSection>
        <PageContainer size="default">
          <FadeScaleTransition mode="out-in">
            <h1 v-if="paperResource" class="text-xl">{{ paperResource.title }}</h1>
            <div v-else class="h-7 max-w-sm" role="status">
              <UiLoadingSection />
            </div>
          </FadeScaleTransition>
        </PageContainer>
      </PageSection>
      <FadeScaleTransition>
        <PageContainer size="default">
          <div class="flex transition-all delay-250 duration-250 items-center" :class="[paperResource ? 'h-10 opacity-100' : 'h-0 opacity-0']">
            <div class="flex-grow items-center flex gap-x-4 self-stretch h-full">
              <WizardSelector v-if="paperResource" :paper="paperResource" />
            </div>
            <div class="flex gap-x-2 items-center self-stretch">
              <HeroButton icon-name="heroicons-solid:eye" label="Preview" :link-props="{ to: { name: 'preview', params: { paperId } } }" />
              <HeroButton icon-name="heroicons-solid:document-check" label="Complete" :link-props="{ to: { name: 'complete', params: { paperId } } }" />
              <HeroButton class="bg-transparent opacity-90" icon-name="heroicons-solid:cog-6-tooth" label="" :link-props="{ to: { name: 'settings', params: { paperId } } }" />
            </div>
          </div>
        </PageContainer>
      </FadeScaleTransition>
    </section>
    <PageSection>
      <PageContainer size="default">
        <NuxtPage v-if="paperResource" :paper="paperResource" />
      </PageContainer>
    </PageSection>
  </div>
</template>
