<template>
  <UiCard>
    <UiFormGrid>
      <ApiResourceFormInput
        :input-props="{
                  attr: { autocomplete: 'given-name', placeholder: 'Jamie' }
                }"
        v-bind="getFormInputProps('firstName', {
                  label: 'Given Name'
                })"
        v-model="model.firstName"
      />

      <ApiResourceFormInput
        :input-props="{
                  attr: { autocomplete: 'family-name', placeholder: 'Smith' }
                }"
        v-bind="getFormInputProps('lastName', { label: 'Family Name' })"
        v-model="model.lastName"
      />

      <ApiResourceFormInput
        type="email"
        :input-props="{
                  attr: { autocomplete: 'email', placeholder: 'jane.doe@ucl.ac.uk' }
                }"
        v-bind="getFormInputProps('email', {
                  label: 'Email Address',
                  infoMessage: 'Other users can add you as an author on a paper using this email address'
                })"
        v-model="model.email"
      />

      <ApiResourceFormInput
        :input-props="{ attr: { placeholder: 'https://orcid.org/0000-0001-2345-6789' } }"
        type="url"
        v-bind="getFormInputProps('orcidId', { label: 'ORCID ID' })"
        v-model="model.orcidId"
      />

      <div class="col-span-2 group-[.drawer-content]:col-span-1">
        <ApiResourceFormTextarea
          :input-props="{ attr: { disabled: disableCompetingInterests, placeholder: competingInterestsPlaceholder } }"
          v-bind="getFormInputProps('competingInterests', { label: 'Competing Interests' })"
          v-model="model.competingInterests"
          ref="competingInterestsTextarea"
        >
          <div class="flex mt-2 items-center gap-x-2">
            <input v-model="disableCompetingInterests" type="checkbox" class="!shadow-none ring-transparent border-0 transition-all duration-250 rounded bg-gray-200 cursor-pointer checked:bg-primary" :value="true" id="no-competing-interests" />
            <label for="no-competing-interests" class="transition-all text-sm text-gray-700 font-medium hover:text-black cursor-pointer select-none">I have no competing interests</label>
          </div>
        </ApiResourceFormTextarea>
      </div>
    </UiFormGrid>
  </UiCard>
</template>

<script lang="ts" setup>
import {useApiResourceForm} from "~/composables/useApiResourceForm";

const model = defineModel<User|PaperAuthor>({
  required: true
})

const competingInterestsTextarea = ref()

const disableCompetingInterests = ref(model.value.competingInterests?.toLowerCase() === 'n/a')
watch(disableCompetingInterests, (isDisabled) => {
  if (!competingInterestsTextarea.value) {
    return
  }
  competingInterestsTextarea.value.updateValue(isDisabled ? 'n/a' : '')
})

const competingInterestsPlaceholder = computed(() => {
  const firstName = model.value.firstName || 'Jamie'
  const lastName = model.value.lastName || 'Smith'
  return `${firstName} ${lastName} has undertaken research, consultancy and training for companies that develop and manufacture related products: [Company] and [Company].`
})

const { getFormInputProps } = useApiResourceForm(model, 'PaperAuthor')
</script>
