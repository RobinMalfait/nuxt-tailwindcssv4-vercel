import FieldWrapper from "~/components/Ui/Form/FieldWrapper.vue";
import type {DebouncedFunc} from "lodash-es";
import {FetchError} from "ofetch";
import type {FieldInputStatus} from "~/components/Ui/Form/FieldStatusIcon.vue";
import type {ModelRef, Ref} from "vue";

export type InputComponentType = abstract new (...args: any) => any
export type InputPropsType<T extends InputComponentType> = Omit<InstanceType<T>["$props"], 'modelValue'>

type ResourcePropsType = {
  endpoint?: string|undefined
  submitKey: string
}

export type BaseType = ResourcePropsType & {
  wrapperProps: InstanceType<typeof FieldWrapper>["$props"]
}

type ApiResourceFormOps = {
  debounceTimeout: number,
  errors?: Ref<string[]|undefined>|undefined
}

export function useApiResourceFormInput<T>(model: ModelRef<T | undefined>, localOps: ResourcePropsType & Partial<ApiResourceFormOps>) {
  const { $api } = useNuxtApp()
  const abortMessage = 'Aborted outdated and incomplete request'

  const defaultOps: ApiResourceFormOps = {
    debounceTimeout: 200
  }

  const ops: ResourcePropsType & ApiResourceFormOps = _merge(defaultOps, localOps)

  let debouncedFn: DebouncedFunc<() => Promise<void>>|undefined
  let resetStatusFn: DebouncedFunc<() => Promise<void>>|undefined

  const localModel = ref<T|undefined>(model.value)
  const submittingValue = ref<T>()
  const pendingSubmitValue = ref<T>()
  const status = ref<FieldInputStatus>()
  const fetchError = ref<FetchError>()
  const violationErrors = ref<{ code: string, message: string, propertyPath: string }[]>()
  let controller: AbortController|undefined

  const apiEndpoint = computed(() => {
    if (!ops.endpoint) {
      return
    }
    const localModelIsStoreModel = localModel.value === model.value
    if (submittingValue.value) {
      if(localModel.value !== submittingValue.value) return ops.endpoint
      return
    }
    if(!localModelIsStoreModel) return ops.endpoint
  })

  async function doApiUpdate (localSubmitValue: T|undefined) {
    if(localSubmitValue === pendingSubmitValue.value) pendingSubmitValue.value = undefined
    const endpoint = apiEndpoint.value
    if (!endpoint) {
      if (!submittingValue.value) {
        violationErrors.value = undefined
        status.value = 'success'
      }
      return
    }
    submittingValue.value = localSubmitValue

    if (controller?.signal && !controller.signal.aborted) {
      controller.abort(abortMessage)
    }

    status.value = 'loading'
    controller = new AbortController();

    const submitBody = {
      [ops.submitKey]: localSubmitValue
    }
    try {
      const response = await $api<Record<typeof ops.submitKey, T>>(endpoint, {
        method: 'PUT',
        body: submitBody,
        signal: controller.signal
      })
      const checkValue = pendingSubmitValue.value || submittingValue.value
      if(localSubmitValue === checkValue) {
        localModel.value = response[ops.submitKey] as typeof model.value
        model.value = localModel.value
      }
      status.value = 'success'
    } catch (error: any) {
      if (error.message === abortMessage) return

      status.value = 'error'
      if (!(error instanceof FetchError)) {
        throw error
      }

      if (error.statusCode === 422) {
        violationErrors.value = error.response?._data?.violations
        if (violationErrors.value) return
      }
      fetchError.value = error
      throw new Error('Update resource error', {
        cause: error
      })
    } finally {
      controller = undefined
      submittingValue.value = undefined
    }
  }

  const errors = computed<string[]>(() => {
    const errors: string[] = (violationErrors.value && violationErrors.value.length) ? [...violationErrors.value.map(v => v.message)] : []
    if (fetchError.value) {
      const message = fetchError.value.statusText || fetchError.value.statusMessage || 'Request error'
      errors.push(`${message} [${fetchError.value.statusCode}]`)
    }
    if (ops.errors?.value) {
      errors.push(...ops.errors.value)
    }
    return errors
  })

  const validationStore = usePaperValidationStore()
  const hasValidationError = computed(() => {
    if (!ops.endpoint) return
    const endpointViolations = validationStore.currentViolationsByIri[ops.endpoint]
    if (!endpointViolations) return false
    for (const v of endpointViolations) {
      if (v.property === ops.submitKey) {
        return true
      }
    }
    return false
  })

  watch(localModel, async (newLocalModel) => {
    fetchError.value = undefined
    violationErrors.value = undefined

    // if the model has been changed elsewhere, we just update the input value and do not need to do an API update
    if (newLocalModel === model.value && !pendingSubmitValue.value && !submittingValue.value || !apiEndpoint.value) {
      // returning to model value that is saved, clear errors and revert to success
      if(ops.endpoint) {
        status.value = 'success'
      } else {
        model.value = localModel.value
      }
      return
    }
    status.value = 'loading'
    pendingSubmitValue.value = newLocalModel
    if (debouncedFn) {
      debouncedFn.cancel()
    }
    debouncedFn = _debounce(async () => {
      await doApiUpdate(newLocalModel)
    }, ops.debounceTimeout)
    debouncedFn()
  })

  watch(model, (newExternalModelValue) => {
    if (newExternalModelValue === submittingValue.value || newExternalModelValue === pendingSubmitValue.value) {
      return
    }
    localModel.value = newExternalModelValue
  })

  watch(status, (newStatus) => {
    if (resetStatusFn) resetStatusFn.cancel()
    if (newStatus === 'success') {
      resetStatusFn = _debounce(() => {
        status.value = undefined
      }, 5000)
      resetStatusFn()
    }
  })

  function updateValue(newValue: T|undefined) {
    localModel.value = newValue
  }

  const mergedStatus = computed<FieldInputStatus|undefined>(() => {
    if (errors.value.length) {
      return 'error'
    }
    if (status.value === undefined && hasValidationError.value) {
      return 'invalid'
    }
    return status.value
  })

  return {
    localModel,
    status: mergedStatus,
    errors,
    updateValue,
    hasValidationError
  }
}
