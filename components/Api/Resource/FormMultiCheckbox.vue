<template>
  <FieldWrapper
    v-bind="wrapperProps"
    :status="status"
    :show-status="!hideIcon"
    :errors="errors"
  >
    <template #default="props">
      <FieldSelect v-bind="inputProps" :options="options" :id="props?.fieldId" v-model="localModel" :status="status" :hide-icon="true" />
      <slot />
    </template>
  </FieldWrapper>
</template>

<script lang="ts" setup>
import FieldWrapper from "~/components/Ui/Form/FieldWrapper.vue";
import type {BaseType, InputPropsType} from "~/composables/useApiResourceFormInput";
import type {ComputedRef} from "vue";
import FieldSelect from "~/components/Ui/Form/FieldSelect.vue";

type FieldInputInputPropsType = InputPropsType<typeof FieldSelect>

type FieldInputType = BaseType & {
  options: FieldInputInputPropsType['options']
  inputProps?: Omit<FieldInputInputPropsType, 'options'>
}

const props = defineProps<FieldInputType>()

const hideIcon: ComputedRef<boolean> = computed<boolean>(() => {
  if (props.inputProps?.hideIcon !== undefined) {
    return props.inputProps?.hideIcon
  }
  return props.endpoint === undefined
})

defineSlots<{
  default(): void
}>()

const model = defineModel<string|null|undefined[]>()

const { localModel, status, errors, updateValue } = useApiResourceFormInput<string|null|undefined>(model, {
  endpoint: props.endpoint,
  submitKey: props.submitKey,
  errors: toRef(props.wrapperProps, 'errors', undefined)
})

defineExpose({
  updateValue
})
</script>
