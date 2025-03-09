<template>
  <FieldWrapper
    v-bind="wrapperProps"
    :status="status"
    :show-status="!hideIcon"
    :errors="errors"
  >
    <template #default="props">
      <FieldInput v-bind="fieldInputProps" :id="props?.fieldId" v-model="localModel" :status="status" :hide-icon="true" />
      <slot />
    </template>
  </FieldWrapper>
</template>

<script lang="ts" setup>
import FieldWrapper from "~/components/Ui/Form/FieldWrapper.vue";
import FieldInput from "~/components/Ui/Form/FieldInput.vue";
import type {BaseType, InputPropsType} from "~/composables/useApiResourceFormInput";
import {useApiResourceInput} from "~/composables/useApiResourceInput";

type FieldInputInputPropsType = InputPropsType<typeof FieldInput>

type FieldInputType = BaseType & {
  type?: NonNullable<FieldInputInputPropsType['attr']>['type']
  inputProps?: FieldInputInputPropsType
}

type ModelType = string|null|undefined

const props = defineProps<FieldInputType>()

const model = defineModel<ModelType>()

const { fieldInputProps, hideIcon, updateValue, localModel, status, errors } = useApiResourceInput<FieldInputInputPropsType, ModelType>()(props, model)

defineSlots<{
  default(): void
}>()

defineExpose({
  updateValue
})
</script>
