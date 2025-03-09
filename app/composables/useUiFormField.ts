import type {FieldInputStatus} from "~/components/Ui/Form/FieldStatusIcon.vue";
import {twMergeArrays} from "~/utils";

export interface BaseProps<ModelType> {
  id?: string
  status?: FieldInputStatus
  hideIcon?: boolean
  modelValue: ModelType
}

type EmitFns<ModelType> = ((evt: "blur") => void) & ((evt: "update:modelValue", value: ModelType) => void)

export function uiFormField<PropsType extends BaseProps<ModelType>, ModelType>(props: PropsType, emit: EmitFns<ModelType>) {
  const model = computed({
    get: () => {
      if (props.modelValue === null) {
        return undefined
      }
      return props.modelValue
    },
    set: (value: ModelType) => emit('update:modelValue', value),
  })

  const inputClassNames = computed(() => {
    return twMergeArrays(DEFAULT_INPUT_CLASSES, borderColor.value)
  })

  const borderColor = computed(() => {
    if (props.status === 'success') {
      return ['border-success', 'focus:border-success', 'focus:outline-success']
    }
    if (props.status === 'error') {
      return ['border-danger', 'focus:border-danger', 'focus:outline-danger']
    }
    return []
  })

  const displayStatus = computed(() => {
    return props.hideIcon ? undefined : props.status
  })

  return {
    model,
    emit,
    inputClassNames,
    displayStatus
  }
}
