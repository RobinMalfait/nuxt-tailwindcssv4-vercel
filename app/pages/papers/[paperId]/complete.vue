<script setup lang="ts">
import CtaButton from "~/components/Ui/CtaButton.vue";
import slugify from "slugify";
import {usePaperWizardsStore} from "~/stores/paperWizardsStore";

const { $api } = useNuxtApp()
const route = useRoute()
const requestingDownload = ref<'json'|'docx'>()

const wizardStore = usePaperWizardsStore()
const validationStore = usePaperValidationStore()

const wizardsByStatus = computed(() => {
  return {
    valid: wizardStore.allWizards.filter(w => w.isComplete.value),
    invalid: wizardStore.allWizards.filter(w => !w.isComplete.value),
  }
})

const { paper } = defineProps<{
  paper: PaperResource
}>()

definePageMeta({
  name: 'complete'
})

async function downloadJSON () {
  if (requestingDownload.value) return
  try {
    requestingDownload.value = 'json'
    const response = await $api<string>(`${paper['@id']}/export`, {
      responseType: 'text'
    })
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(response)
    downloadFile(dataStr, 'json')
  } finally {
    requestingDownload.value = undefined
  }
}

async function downloadDocument () {
  if (requestingDownload.value) return
  try {
    requestingDownload.value = 'docx'
    const documentData = await $api<Blob>(`${paper['@id']}/download`, {
      responseType: 'blob'
    })
    downloadFile(window.URL.createObjectURL(documentData), 'docx')
  } finally {
    requestingDownload.value = undefined
  }
}

function downloadFile (data: string, extension: 'json'|'docx') {
  const filename = slugify(paper.title) + '.' + extension
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = data
  link.setAttribute('download', filename)
  // Safari thinks _blank anchor are popups. We only want to set _blank
  // target if the browser does not support the HTML5 download attribute.
  // This allows you to download files in desktop safari if popup blocking
  // is enabled.
  if (typeof link.download === 'undefined') {
    link.setAttribute('target', '_blank')
  }
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <PageSection>
    <PageContainer class="" size="narrow">
      <UiPageIntro class="mb-10" title="Complete Paper" text="Review the status of your wizards and export your paper as a JSON or Word file, ready for submission to your journal of choice." />
      <Transition>
        <div v-if="!validationStore.validationLoaded">
          <UiPageLoadingSpinner message="Loading validation data..." />
        </div>
        <div v-else class="flex flex-col">
          <section class="shadow-xl border py-6 px-4 rounded-lg">
            <div class="flex gap-x-2 items-center border-b pb-3 px-2">
              <div>
                <UiStatus status="success" size="size-4"  />
              </div>
              <div class="font-bold">
                <span class="text-success">Congratulations!</span> You have completed {{ wizardsByStatus.valid.length }} of {{ wizardStore.allWizards.length }} wizards
              </div>
            </div>
            <ul class="flex flex-col gap-y-3 mt-4">
              <li class="px-0.5" v-for="wizard of wizardsByStatus.invalid" :key="`invalid-wizard-${wizard.routeName}`">
                <NuxtLink :to="{ name: wizard.routeName, params: route.params }" class="flex gap-x-2 items-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition outline outline-1 rounded p-2 outline-gray-300">
                  <div>
                    <UiStatus status="warning-outline" size="size-3"  />
                  </div>
                  <div class="flex-grow">
                    <span class="font-bold text-gray-800">{{ wizard.name }}</span> has <span class="font-bold text-gray-800">{{ wizard.errorCount }}</span> issue{{ wizard.errorCount.value !== 1 ? 's' : '' }} to resolve
                  </div>
                  <div class="block leading-0">
                    <Icon class="block" name="heroicons-solid:chevron-double-right" />
                  </div>
                </NuxtLink>
              </li>
            </ul>
          </section>
          <section class="mt-10">
            <UiNotification v-if="wizardsByStatus.invalid.length" type="info" class="mb-4 text-sm font-bold">
              You still have {{ wizardsByStatus.invalid.length }} wizards to complete so your downloads will be missing important fields. It is highly likely your paper will be rejected in the review process by any journal that you submit it to.
            </UiNotification>
            <div class="flex gap-x-4 justify-start">
              <div>
                <CtaButton :preset="wizardsByStatus.invalid.length ? undefined : 'success'" @click="downloadJSON" :disabled="requestingDownload" :loading="requestingDownload === 'json'">
                  Download JSON
                </CtaButton>
              </div>
              <div>
                <CtaButton :preset="wizardsByStatus.invalid.length ? undefined : 'success'" @click="downloadDocument" :disabled="requestingDownload" :loading="requestingDownload === 'docx'">
                  Download MS Word Document
                </CtaButton>
              </div>
            </div>
          </section>
        </div>
      </Transition>
    </PageContainer>
  </PageSection>
</template>
