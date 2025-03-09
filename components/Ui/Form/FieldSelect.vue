<template>
  <div class="relative">
    <select
      v-model="model"
      :class="inputClassNames"
      v-bind="attr"
    >
      <option v-if="attr?.placeholder" disabled :value="undefined">{{ attr.placeholder }}</option>
      <option v-for="option in options" :key="`select-option-${option.value}`" :value="option.value">{{ option.label }}</option>
    </select>
    <FieldStatusIcon :status="displayStatus" role="status" />
  </div>
</template>

<script lang="ts" setup>
import FieldStatusIcon from "~/components/Ui/Form/FieldStatusIcon.vue";
import {type BaseProps, uiFormField} from "~/composables/useUiFormField";
import {twMerge} from "tailwind-merge";
import type {SelectHTMLAttributes} from "vue";

type ModelType = string|null|undefined|object
export type SelectOption = {
  label: string
  value: ModelType
}

export type FieldInputProps = BaseProps<ModelType> & {
  options: SelectOption[]
  attr?: SelectHTMLAttributes
}

const props = defineProps<FieldInputProps>()
const emit = defineEmits<{
  blur: [],
  'update:modelValue': [value: ModelType]
}>()

defineOptions({
  inheritAttrs: false
})

const { model, inputClassNames: baseInputClassNames, displayStatus } = uiFormField<typeof props, ModelType>(props, emit)

const inputClassNames = computed(() => {
  return twMerge(baseInputClassNames.value, displayStatus.value ? 'pr-11' : 'pr-8', (props.attr?.placeholder && (model.value === undefined || model.value === null)) ? 'text-gray-400' : '')
})
</script>
