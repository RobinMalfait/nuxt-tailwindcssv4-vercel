<template>
  <FieldWrapper
    v-bind="wrapperProps"
    :status="status"
    :show-status="!hideIcon"
    :errors="errors"
  >
    <template #default="props">
      <FieldTextarea v-bind="fieldInputProps" :id="props?.fieldId" v-model="localModel" :status="status" :hide-icon="true" />
      <slot />
    </template>
  </FieldWrapper>
</template>

<script lang="ts" setup>
import FieldWrapper from "~/components/Ui/Form/FieldWrapper.vue";
import FieldTextarea from "~/components/Ui/Form/FieldTextarea.vue";
import type {BaseType, InputPropsType} from "~/composables/useApiResourceFormInput";
import {useApiResourceInput} from "~/composables/useApiResourceInput";

type FieldInputInputPropsType = InputPropsType<typeof FieldTextarea>

type FieldTextareaType = BaseType & {
  inputProps?: FieldInputInputPropsType
}

type ModelType = string|null|undefined

const props = defineProps<FieldTextareaType>()

defineSlots<{
  default(): void
}>()

const model = defineModel<ModelType>()

const { fieldInputProps, hideIcon, updateValue, localModel, status, errors } = useApiResourceInput<FieldInputInputPropsType, ModelType>()(props, model)

defineExpose({
  updateValue
})
</script>
