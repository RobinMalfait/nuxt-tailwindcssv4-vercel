<template>
  <div class="relative">
    <RadioInput v-bind="cProps" :status="status" v-model="model" />
  </div>
</template>

<script lang="ts" setup>
import RadioInput, {type RadioGroupModel} from "~/components/Ui/Form/RadioInput.vue"
import {type BaseProps, uiFormField} from "~/composables/useUiFormField";

export type FieldRadioInputProps  = BaseProps<RadioGroupModel> & {
  cProps: Omit<InstanceType<typeof RadioInput>["$props"], 'modelValue'|'status'>
}

const props = defineProps<FieldRadioInputProps>()
const emit = defineEmits<{
  blur: [],
  'update:modelValue': [value: RadioGroupModel]
}>()

defineOptions({
  inheritAttrs: false
})

const { model } = uiFormField<typeof props, RadioGroupModel>(props, emit)
</script>
