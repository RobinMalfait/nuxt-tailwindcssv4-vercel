<template>
  <div class="relative">
    <input v-bind="attr" v-model="model" :class="inputClassNames" @blur="emit('blur')" />
    <FieldStatusIcon :status="displayStatus" role="status" />
  </div>
</template>

<script lang="ts" setup>
import type {InputHTMLAttributes} from "vue"
import FieldStatusIcon from "~/components/Ui/Form/FieldStatusIcon.vue";
import {type BaseProps, uiFormField} from "~/composables/useUiFormField";
import {twMerge} from "tailwind-merge";

type ModelType = string|null|undefined

export type FieldInputProps = BaseProps<ModelType> & {
  attr?: Omit<InputHTMLAttributes, "type"> & {
    type?: Exclude<InputHTMLAttributes['type'], "radio">
  }
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
  return twMerge(baseInputClassNames.value, displayStatus.value ? 'pr-11' : 'pr-3')
})
</script>
