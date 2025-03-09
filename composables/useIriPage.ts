export const useIriPage = <T extends ApiResource>() => {
  const route = useRoute()
  const { $api } = useNuxtApp()
  const resourcesStore = useApiResourcesStore()

  const isLoading = ref(true)
  const iri = computed(() => {
    const iriParam = route.params.iri
    if (Array.isArray(iriParam)) {
      return iriParam[0]
    }
    return iriParam
  })

  async function loadResource () {
    if (!iri.value) return
    isLoading.value = true
    try {
      const resource = await $api<T>(iri.value)
      resourcesStore.saveResource(resource)
    } finally {
      isLoading.value = false
    }
  }

  onMounted(async () => {
    await loadResource()
  })

  const resource = computed(() => {
    return resourcesStore.getResource<T>(iri.value).value
  })

  return {
    iri,
    isLoading,
    loadResource,
    resource
  }
}
