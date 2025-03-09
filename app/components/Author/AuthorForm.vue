<template>
  <div v-if="storeResource">
    <ApiResourceFormRadioInput
      v-if="!isDefaultAuthor"
      :input-props="{ options: authorTypeOptions }"
      v-bind="getFormInputProps('role', { label: 'Type of contributor' })"
      v-model="storeResource.role"
    />

    <UiTabs :tabs="tabs">
      <template #item="{ item }">
        <AuthorContribution
          v-if="item.label === 'Contribution'"
          v-model="storeResource"
        />
        <AuthorInstitutions
          v-if="item.label === 'Institutions'"
          v-model="storeResource"
          :is-loading="isLoading"
          @reload="emit('reload')"
        />
        <AuthorPersonal
          v-if="item.label === 'Personal'"
          v-model="storeResource"
        />
      </template>
    </UiTabs>
  </div>
</template>

<script lang="ts" setup>
import type { ApiResourceFormProps } from "~/composables/useApiResourceForm"
import AuthorInstitutions from "~/components/Author/AuthorInstitutions.vue";
import AuthorPersonal from "~/components/Author/AuthorPersonal.vue";

const props = defineProps<ApiResourceFormProps & {
  isDefaultAuthor?: boolean
  isLoading?: boolean
}>()

const emit = defineEmits<{
  reload: []
}>()

const resourceProp = toRef(props, 'resource')
watch(resourceProp, () => {
  // on author drawer page this will cause infinite loop because store will change value, and then change prop
  // when something fails, comment why we are solving this issue with a re initialisation
  // initForm(true)
})

const { resource: storeResource, getFormInputProps, init: initForm } = useApiResourceForm<User>(resourceProp, 'PaperAuthor')

const authorTypeOptions = [
  {
    label: 'Author',
    value: 'author'
  },
  {
    label: 'Non-author contributor',
    value: 'contributor'
  },
  {
    label: 'Reviewer',
    value: 'reviewer'
  }
]

const tabs = computed(() => {
  const currentTabs = []
  if (storeResource.value.role === 'author') {
    currentTabs.push({
      label: 'Contribution'
    })
  }
  currentTabs.push({
    label: 'Personal'
  },
  {
    label: 'Institutions'
  })
  return currentTabs
})

</script>
