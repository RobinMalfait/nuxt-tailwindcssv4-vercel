<template>
  <LazyUiFormFieldInput
    v-if="inputType === 'hidden'"
    v-model="model"
    class="hidden"
    :status="uiStatus"
    :attr="{ ...inputData._vars?.attr, name: fieldId, id: fieldId, type: inputType, disabled }"
  />
  <LazyUiCtaButton v-else-if="inputType === 'submit'" class="[&:not(:last-child)]:mb-4" type="submit" :disabled="disabled">{{ inputData._vars?.label }}</LazyUiCtaButton>
  <LazyUiFormFieldWrapper v-else-if="inputType !== 'repeated'" :label="inputData._vars?.label" :errors="errors">
    <template #default="{ fieldId }">
      <LazyUiFormFieldTextarea
        v-if="inputType === 'textarea'"
        :attr="{ ...inputData._vars?.attr, name: fieldId, id: fieldId, type: inputType || 'text', disabled, required: inputData._vars?.required  }"
        :status="uiStatus"
        v-model="model"
        @blur="fieldHasBeenBlurred = true"
      />
      <LazyUiFormFieldInput
        v-else
        :attr="{ ...inputData._vars?.attr, name: fieldId, id: fieldId, type: inputType || 'text', disabled, required: inputData._vars?.required }"
        :status="uiStatus"
        v-model="model"
        @blur="fieldHasBeenBlurred = true"
      />
    </template>
  </LazyUiFormFieldWrapper>
  <ApiFormField
    v-for="(childInputData, inputName) of inputData.children as { [inputName: string]: any }"
    :input-data="childInputData"
    :parent-input-data="inputData"
    :submit-body="submitBody"
    :submit-path="submitPath"
    :input-name="`${inputName}`"
    :fullFormSubmitted="fullFormSubmitted"
    @change="onNestedChanged"
  />
</template>

<script setup lang="ts">
import {FetchError} from "ofetch";
import type { DebouncedFunc } from 'lodash-es'
import type {ApiFormResponse, InputDataType, ApiFormData} from "~/composables/useApiForm";
import type {FieldInputStatus} from "~/components/Ui/Form/FieldStatusIcon.vue";

type HTMLInputTypeAttribute = "textarea" | "repeated" | "button" | "checkbox" | "color" | "date" | "datetime-local" | "email" | "file" | "hidden" | "image" | "month" | "number" | "password" | "radio" | "range" | "reset" | "search" | "submit" | "tel" | "text" | "time" | "url" | "week"

const props = defineProps<{
  disabled?: boolean
  inputData: InputDataType
  parentInputData?: InputDataType
  inputName: string
  submitBody: any
  submitPath: string
  fullFormSubmitted?: boolean
}>()
const emit = defineEmits<{
  change: [fieldName: string, formData: ApiFormData, status: FieldInputStatus]
}>()

const { $api } = useNuxtApp()
const fieldId = useId()
const status = ref<FieldInputStatus>()
const fieldHasBeenBlurred = ref(false)
const displayErrors = ref(status.value === 'success')
let debouncedFn: DebouncedFunc<() => Promise<undefined>>

function getInputType (inputData: InputDataType): HTMLInputTypeAttribute {
  const types = inputData._vars.block_prefixes.filter((prefix: string) => !prefix.startsWith('_'))
  return types[types.length - 1]
}

const inputType = computed<HTMLInputTypeAttribute>(() => {
  return getInputType(props.inputData)
})

const parentInputType = computed(() => {
  if (!props.parentInputData) {
    return
  }
  return getInputType(props.parentInputData)
})

const isChildOfRepeated = computed(() => {
  if (!parentInputType.value) {
    return false
  }
  return parentInputType.value === 'repeated'
})

const model = computed({
  get() {
    return _get(props.submitBody, props.inputName)
  },
  set(newValue) {
    _set(props.submitBody, props.inputName, newValue)
  }
})

const errors = computed(() => {
  return displayErrors.value ? props.inputData._vars?.errors : undefined
})

const uiStatus = computed(() => {
  if (status.value === 'error' && !displayErrors.value) {
    return
  }
  return status.value
})

watch(() => props.fullFormSubmitted, (isSubmitted) => {
  if (isSubmitted) displayErrors.value = true
})

watch(errors, () => {
  if (errors.value?.length) {
    status.value = 'error'
  }
})

async function validateField () {
  status.value = 'loading'
  let body = {}

  // set the other repeated field for validation
  // if user not entered yet, we do not need an error saying they do not match
  if (props.parentInputData && isChildOfRepeated.value) {
    for(const inputName of Object.keys(props.parentInputData.children)) {
      if (inputName === props.inputName) {
        continue
      }
      const currentSubmitValue = _get(props.submitBody, inputName)
      const submitOtherValue = (currentSubmitValue === undefined || currentSubmitValue === '') ? model.value : currentSubmitValue
      body = _set(body, inputName, submitOtherValue)
    }
  }

  body = _set(body, props.inputName, model.value)

  try {
    const response = await $api<ApiFormResponse>(props.submitPath, {
      method: 'patch',
      body
    })
    status.value = 'success'
    emit('change', props.inputName, response.form, status.value)
  } catch (error: any) {
    if (!(error instanceof FetchError)) {
      throw error
    }
    status.value = 'error'
    emit('change', props.inputName, error.data.form, status.value)
  }
}

function onNestedChanged(inputName: string, form: ApiFormData, status: FieldInputStatus) {
  emit('change', inputName, form, status)
}

const unwatchBlurField = watch(fieldHasBeenBlurred, (hasBlurred) => {
  if (hasBlurred) {
    displayErrors.value = true
    unwatchStatus()
    unwatchBlurField()
  }
})
const unwatchStatus = watch(uiStatus, (newStatus) => {
  if (newStatus === 'success') {
    displayErrors.value = true
    unwatchStatus()
    unwatchBlurField()
  }
})

watch(() => props.inputData.status, (newStatus) => {
  if (newStatus === null || model.value === '' || model.value === undefined) {
    return
  }
  status.value = newStatus
})

watch(model, async () => {
  if (debouncedFn) {
    debouncedFn.cancel()
  }
  debouncedFn = _debounce(validateField, 200)
  debouncedFn()
})
</script>
