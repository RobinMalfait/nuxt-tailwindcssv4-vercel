import { defineStore } from 'pinia'

export type ResourceViolationsType = {
  [key: string]: string[]
}

export type ApiStateType = {
  statusCode?: number
  submitBody?: PartialResource<any>
  violations?: ResourceViolationsType
}

export const useApiResourcesStore = defineStore('api-resources', () => {
  const byId = ref<{
    [key: string]: {
      resource: ApiResource
      apiState: ApiStateType
    }
  }>({})
  const allIds = computed<string[]>(() => Object.keys(byId.value))

  function saveResource (resource: ApiResource) {
    byId.value[resource['@id']] = {
      resource: { ...resource },
      apiState: {}
    }
  }

  function getResource <T extends ApiResource>(id: string) {
    return computed({
      get: () => byId.value[id]?.resource as T|undefined,
      set(newResource: T) {
        if (newResource['@id'] !== id) {
          return
        }
        saveResource(newResource)
      }
    })
  }

  function getApiState (id: string) {
    return readonly(byId.value[id]?.apiState)
  }

  function setApiState(id: string, state: Partial<ApiStateType>) {
    if (!byId.value[id]) return
    byId.value[id].apiState = state
  }

  function clearApiState(id: string) {
    if (!byId.value[id]) return
    byId.value[id].apiState = {}
  }

  function clearResources () {
    byId.value = {}
  }

  return {
    allIds,
    byId: computed(() => byId.value),
    getResource,
    getApiState,
    setApiState,
    clearApiState,
    saveResource,
    clearResources
  }
})
