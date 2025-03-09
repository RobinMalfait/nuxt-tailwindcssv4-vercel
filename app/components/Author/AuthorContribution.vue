<script setup lang="ts">
import {useApiResourceForm} from "~/composables/useApiResourceForm";
import {arrayToInputOptions} from "~/utils";

const model = defineModel<User|PaperAuthor>({
  required: true
})
const { getFormInputProps, resource: storeResource } = useApiResourceForm(model, 'PaperAuthor')

const creditOptions = arrayToInputOptions([
  'Conceptualization',
  'Data curation',
  'Formal Analysis',
  'Funding acquisition',
  'Investigation',
  'Methodology',
  'Project administration',
  'Resources',
  'Software',
  'Supervision',
  'Validation',
  'Visualization',
  'Writing – original draft',
  'Writing – review & editing'
])

</script>

<template>
  <UiCard>
    <div class="flex gap-x-4">
      <div class="flex-shrink-0">
        <img src="/assets/images/credit-logo.png" alt="CRediT Logo" class="size-12" />
      </div>
      <div class="flex-grow-1 prose text-sm">
        <p class="mb-0">
          CRediT (Contributor Roles Taxonomy) is a high-level taxonomy, including 14 roles, that can be used to represent the roles typically played by contributors to scientific scholarly output. The roles describe each contributor’s specific contribution to the scholarly output.
        </p>
        <p class="mt-0">
          <NuxtLink target="_blank" to="https://casrai.org/credit/" class="transition text-primary no-underline hover:text-blue-800">https://casrai.org/credit/</NuxtLink>
        </p>
      </div>
    </div>
    <div class="mt-5">
      <ApiResourceFormMultiCheckbox
        :input-props="{
                attr: { placeholder: 'Select' }
              }"
        v-bind="getFormInputProps('contributions', {
                label: 'How did this author contribute to this study?'
              })"
        :options="creditOptions"
        v-model="storeResource.contributions"
      />
    </div>
  </UiCard>
</template>
