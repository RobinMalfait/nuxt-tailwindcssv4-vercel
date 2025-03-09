<template>
  <UiFormGrid v-if="storeResource">
    <ApiResourceFormInput
      :input-props="{
                attr: { placeholder: 'University of PAT' }
              }"
      v-bind="getFormInputProps('name', {
                label: 'Institution Name'
              })"
      v-model="storeResource.name"
    />
    <ApiResourceFormInput
      :input-props="{
                attr: { placeholder: '123 High Street' }
              }"
      v-bind="getFormInputProps('addressStreet', {
                label: 'Address Street'
              })"
      v-model="storeResource.addressStreet"
    />
    <ApiResourceFormInput
      :input-props="{
                attr: { placeholder: 'AB12 3CD' }
              }"
      v-bind="getFormInputProps('addressPostcode', {
                label: 'Address Postcode / ZIP'
              })"
      v-model="storeResource.addressPostcode"
    />
    <ApiResourceFormInput
      :input-props="{
                attr: { placeholder: 'Department of PAT' }
              }"
      v-bind="getFormInputProps('department', {
                label: 'Department'
              })"
      v-model="storeResource.department"
    />
    <ApiResourceFormInput
      :input-props="{
                attr: { placeholder: 'London' }
              }"
      v-bind="getFormInputProps('addressCity', {
                label: 'Address City'
              })"
      v-model="storeResource.addressCity"
    />
    <ApiResourceFormSelect
      :input-props="{
                attr: { placeholder: 'Select A Country' }
              }"
      v-bind="getFormInputProps('addressCountry', {
                label: 'Address Country'
              })"
      :options="countryOptions"
      v-model="storeResource.addressCountry"
    />
  </UiFormGrid>
</template>

<script lang="ts" setup>
const { countryOptions } = useCountryOptions()

type ExpectedInstitutionType = UserInstitution|PaperAuthorInstitution

type PropsType = {
  isNew: true
  resource?: undefined
  initialData?: Partial<ExpectedInstitutionType>
  initialId?: '/account/user_institutions/0'|'/account/paper_author_institutions/0'
} | {
  isNew?: false
  resource: ExpectedInstitutionType
}

const props = defineProps<PropsType & {}>()

const newResource: PartialResource<ExpectedInstitutionType> = {
  '@id': props.isNew ? props.initialId : undefined
}

const resourceRef = props.isNew ? ref(newResource) : toRef(props, 'resource')
const { resource: storeResource, getFormInputProps } = useApiResourceForm<ExpectedInstitutionType>(resourceRef, 'PaperAuthorInstitution', props.isNew ? props.initialData : {})
</script>
