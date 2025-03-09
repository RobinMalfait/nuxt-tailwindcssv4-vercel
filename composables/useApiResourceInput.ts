import type {ComputedRef, ModelRef} from "vue";
import type {BaseType, InputComponentType, InputPropsType} from "~/composables/useApiResourceFormInput";

export const useApiResourceInput = <T extends InputPropsType<InputComponentType>, MT>() => {
  type FieldInputType = BaseType & {
    type?: NonNullable<T['attr']>['type']
    inputProps?: T
  }

  function init<FTI extends FieldInputType>(props: FTI, model: ModelRef<MT>) {
    const fieldInputProps = computed<FTI['inputProps']>(() => {
      if (props.type) {
        return _merge({}, props.inputProps, { attr: { type: props.type }, hideIcon: props.inputProps?.hideIcon })
      }
      return props.inputProps
    })

    // hide icon is either from the passed field input props, otherwise defaults to if there is an endpoint specified
    const hideIcon: ComputedRef<boolean> = computed<boolean>(() => {
      if (fieldInputProps.value?.hideIcon !== undefined) {
        return fieldInputProps.value.hideIcon
      }
      return props.endpoint === undefined
    })

    const { localModel, status, errors, updateValue } = useApiResourceFormInput<MT>(model, {
      endpoint: props.endpoint,
      submitKey: props.submitKey,
      errors: toRef(props.wrapperProps, 'errors', undefined)
    })

    return {
      fieldInputProps,
      hideIcon,
      updateValue,
      localModel,
      status,
      errors
    }
  }

  return init
}
