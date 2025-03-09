<script setup lang="ts">
import {navigateTo} from "#app";

const { paper } = defineProps<{
  paper: PaperResource
}>()

definePageMeta({
  name: 'settings'
})

const { $api } = useNuxtApp()

const deleteConfirm = ref(false)
async function deletePaper() {
  try {
    await $api(paper["@id"], {
      method: 'DELETE'
    })

    await navigateTo({ name: 'papers' })
  } catch (error) {
    console.error(error)
    return false
  }
}
</script>

<template>
  <PageSection>
    <PageContainer size="narrow">
      <UiCard class="prose border-danger">
        <h2 class="text-lg text-danger font-semibold mt-0">Danger zone</h2>
        <p class="text-sm text-gray-500">You can permanently delete your paper here. Authors and contributors will still have access to PAT. Other users may have downloaded this paper and be able to re-create it if they wish.</p>
        <button
          class="transition px-3 py-1 text-semibold border w-full rounded-lg border-danger text-danger hover:bg-danger hover:text-white"
          @click="deleteConfirm = true">
          Permanently Delete Paper
        </button>
      </UiCard>
      <Teleport to="body">
        <UiModalConfirmDanger
          :open="deleteConfirm"
          :action="deletePaper"
          title="Are you sure?"
          button-text="Permanently delete this paper"
          @close="deleteConfirm = false"
        >
          <div class="prose">
            <p class="font-bold text-danger">The following data will be permanently deleted:</p>
            <ul class="list">
              <li class="list-item">Your paper and all associated data</li>
            </ul>
            <p class="font-bold text-danger">This action cannot be reversed.</p>
          </div>
        </UiModalConfirmDanger>
      </Teleport>
    </PageContainer>
  </PageSection>
</template>
