<template>
  <UiWizardResourceList
    v-model="model.institutions"
    :initial-data="initialData"
    resource-name="institution"
    :is-loading="isLoading"
    :endpoint="endpoint"
    @reload="emit('reload')"
  >
    <template #add="{ closeFn }">
      <AuthorInstitutionForm
        :is-new="true"
        :initial-id="initialId"
        @close="closeFn"
        @success="emit('reload')"
      />
    </template>
    <template #card="{ resource }">
      <AuthorInstitutionForm
        :resource="resource"
      />
    </template>
  </UiWizardResourceList>
</template>

<script lang="ts" setup>
import AuthorInstitutionForm from "~/components/Author/AuthorInstitutionForm.vue";

type AnyAuthorType = PaperAuthor|User
type AnyInstitutionType = PaperAuthorInstitution|UserInstitution

const model = defineModel<AnyAuthorType>({
  required: true
})

const emit = defineEmits<{
  reload: []
}>()

defineProps<{
  isLoading?: boolean
}>()

const isPaperAuthor = computed(() => {
  return model.value['@type'] === 'PaperAuthor'
})

const initialData = computed((): Partial<AnyInstitutionType> => {
  if (isPaperAuthor.value) {
    return {
      paperAuthor: model.value['@id']
    }
  }
  return {
    user: model.value['@id']
  }
})

const initialId = computed<'/account/user_institutions/0'|'/account/paper_author_institutions/0'>(() => {
  return `${endpoint.value}/0`
})

const endpoint = computed<'/account/user_institutions'|'/account/paper_author_institutions'>(() => {
  if (isPaperAuthor.value) {
    return '/account/paper_author_institutions'
  }
  return '/account/user_institutions'
})
</script>
