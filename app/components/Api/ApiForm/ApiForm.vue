<template>
  <div>
    <form
      v-if="!showFormSuccess && submitBody[formPrefix]"
      :action="`${formIri}/submit`"
      method="POST"
      @submit.prevent="submitForm"
    >
      <div v-if="!submitting && formData.form.vars.errors && formData.form.vars.errors.length" class="flex flex-col gap-y-2 mb-4">
        <UiNotification v-for="(errorMessage, index) of formData.form.vars.errors" :key="`error-${index}`" type="error">
          {{ errorMessage }}
        </UiNotification>
      </div>

      <ApiFormField
        v-for="inputName of inputNames"
        :key="`input-${inputName}`"
        :full-form-submitted="!!fullFormSubmitted"
        v-bind="getFormFieldProps(inputName)"
        @change="updateFormData"
      />

      <slot name="end">
        <div v-if="submitText">
          <CtaButton :disabled="submitting" type="submit">{{ submitText }}</CtaButton>
        </div>
      </slot>
    </form>
    <div v-else-if="showFormSuccess">
      <slot name="success" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {useApiForm} from "~/composables/useApiForm";
import CtaButton from "~/components/Ui/CtaButton.vue";
import ApiFormField from "~/components/Api/ApiForm/ApiFormField.vue";

const slots = defineSlots<{
  end(): any,
  success(): any
}>()
const { isSlotEmpty } = useIsSlotEmpty(slots.success)

const showFormSuccess = computed(() => {
  return !isSlotEmpty.value && formSubmitSuccess.value
})

const props = defineProps<{
  formIri: `/forms/${string}`
  formPrefix: string
  submitPath?: string
  submitText?: string
}>()

const {
  getFormFieldProps,
  submitForm,
  submitting,
  submitBody,
  inputNames,
  updateFormData,
  formSubmitSuccess,
  formData,
  response,
  fullFormSubmitted
} = await useApiForm(props.formIri, props.formPrefix, props.submitPath)

defineExpose({
  success: formSubmitSuccess,
  submitBody,
  submitting,
  response
})
</script>
