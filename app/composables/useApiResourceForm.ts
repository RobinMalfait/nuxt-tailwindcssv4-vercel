import FieldWrapper from "~/components/Ui/Form/FieldWrapper.vue";
import {type Ref, type MaybeRef, toValue} from "vue";
import {FetchError} from "ofetch";
import type {ResourceViolationsType} from "~/stores/apiResourcesStore";

export interface ApiResourceFormProps {
  resource: User
}

export type FormInputPropsOpsType = {
  wrapper?: InstanceType<typeof FieldWrapper>["$props"]
  info?: {
    show: boolean,
    resourceOrResourceType: ApiResource|string
  }
}

type InfoIdResource = ApiResource|string

function getInfoIdParts(resource: InfoIdResource, key: string) {
  const resourceType = typeof resource === 'string' ? resource : resource?.['@type']
  if (!resourceType) {
    return [key]
  }
  return [resourceType, key]
}

export function getBaseFormInputProps (endpoint: string|undefined, submitKey: string, ops?: FormInputPropsOpsType) {
  const wrapperProps: InstanceType<typeof FieldWrapper>["$props"] = {
    ...(ops?.wrapper || {}),
    infoIdParts: ops?.info?.show ? getInfoIdParts(ops.info.resourceOrResourceType, submitKey) : undefined
  }
  return {
    endpoint,
    submitKey,
    wrapperProps
  }
}

export function useApiResourceForm <T extends ApiResource>(resource: Ref<PartialResource<T>|undefined>, resourceOrResourceType?: InfoIdResource, initialData?: MaybeRef<undefined|Partial<T>>) {
  const apiResourceStore = useApiResourcesStore()
  const { $api } = useNuxtApp()
  const isCreatingResource = ref(false)
  const isNew = computed(() => (resource.value['@id'].endsWith('/0')))
  const apiState = computed(() => (resource.value['@id'] ? apiResourceStore.getApiState(resource.value['@id']) : {}))

  const submitCounter = ref(0)

  const storeResource = computed<PartialResource<T>|undefined>({
    get: () => {
      if (!resource.value) return
      return apiResourceStore.getResource<T>(resource.value['@id']).value
    },
    set: (newValue: PartialResource<T>|undefined) => {
      if (newValue) {
        apiResourceStore.saveResource(newValue)
      }
    }
  })

  function init(force?: boolean) {
    if (resource.value && (force || !storeResource.value)) apiResourceStore.saveResource(resource.value)
  }

  function getFormInputProps (submitKey: string, wrapperProps?: ComponentProps<typeof FieldWrapper>) {
    const wrapperPropsWithErrors =
      isNew.value ?
        _merge({}, wrapperProps || {}, { errors: computed(() => apiState.value.violations?.[submitKey]) }) :
        wrapperProps

    const inputInfoOps = resourceOrResourceType ? {
      show: true,
      resourceOrResourceType
    } : undefined

    return getBaseFormInputProps(
      isNew.value ? undefined : resource.value?.['@id'],
      submitKey,
      {
        wrapper: wrapperPropsWithErrors,
        info: inputInfoOps
      }
    )
  }

  async function createResource () {
    submitCounter.value++
    const submitCount = submitCounter.value
    apiResourceStore.clearApiState(resource.value['@id'])

    const body = _merge({}, initialData ? toValue(initialData) : {}, storeResource.value)
    isCreatingResource.value = true

    try {
      const endpointParts = resource.value['@id'].split('/')
      endpointParts.pop()

      await $api(endpointParts.join('/'), {
        method: 'POST',
        body
      })

      if (submitCount === submitCounter.value) {
        apiResourceStore.setApiState(resource.value['@id'],{
          submitBody: body,
          statusCode: 200
        })
        isCreatingResource.value = false
      }

      return true
    } catch (error: any) {
      if (!(error instanceof FetchError)) {
        throw error
      }
      console.error(error)

      if (submitCount === submitCounter.value) {
        const violations: ResourceViolationsType = {}
        if (error.status === 422) {
          for (const v of error.data.violations) {
            if (!violations[v.propertyPath]) {
              violations[v.propertyPath] = []
            }
            violations[v.propertyPath].push(v.message)
          }
        }

        apiResourceStore.setApiState(resource.value['@id'],{
          submitBody: body,
          statusCode: error.status,
          violations: violations
        })
        isCreatingResource.value = false
      }

      return false
    }
  }

  init()

  return {
    resource: storeResource,
    getFormInputProps,
    init,
    apiState,
    createResource,
    isCreatingResource,
    clearApiState: () => {
      return apiResourceStore.clearApiState(resource.value['@id'])
    }
  }
}
