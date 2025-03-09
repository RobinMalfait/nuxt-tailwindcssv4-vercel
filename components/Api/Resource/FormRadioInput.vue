<template>
  <FieldWrapper
    v-bind="wrapperProps"
    :status="status"
    :show-status="!hideIcon"
    :errors="errors"
  >
    <template #default="props">
      <FieldRadioInput :c-props="fieldInputProps" :id="props?.fieldId" v-model="localModel" :status="status" :hide-icon="true" />
      <slot />
    </template>
  </FieldWrapper>
</template>

<script lang="ts" setup>
import FieldWrapper from "~/components/Ui/Form/FieldWrapper.vue";
import FieldRadioInput from "~/components/Ui/Form/FieldRadioInput.vue";
import type {BaseType, InputPropsType} from "~/composables/useApiResourceFormInput";
import type {RadioGroupModel} from "~/components/Ui/Form/RadioInput.vue";
import {useApiResourceInput} from "~/composables/useApiResourceInput";

type FieldRadioInputTypeBase = InputPropsType<typeof FieldRadioInput>

type FieldRadioInputType = BaseType & {
  inputProps: FieldRadioInputTypeBase['cProps']
}

const model = defineModel<RadioGroupModel>()

const props = defineProps<FieldRadioInputType>()

defineSlots<{
  default(): void
}>()

const initFn = useApiResourceInput<FieldRadioInputTypeBase['cProps'], RadioGroupModel>()
const { fieldInputProps, hideIcon, updateValue, localModel, status, errors } = initFn<FieldRadioInputType>(props, model)

defineExpose({
  updateValue
})
</script>
