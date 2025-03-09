import type { Ref } from 'vue'
import { computed, ref, watch } from 'vue'
import { type LocationQuery, useRoute } from 'vue-router'
import {FetchError} from "ofetch";

type CollectionResourceType = { 'hydra:member': ApiResource[], 'hydra:view': { 'hydra:last': string } } & ApiResource

export const useCollectionResource = (endpoint: string, itemsPerPage: number = 5) => {
  const { $api } = useNuxtApp()

  const isLoadingCollection = ref(false)
  const resource = ref<CollectionResourceType>()
  const error = ref<string>()
  const fetchId = ref<number>(1)
  const abortController = ref<AbortController>()
  const latestSuccessFetchId = ref<typeof fetchId.value>()

  const route = useRoute()
  const { model: pageModel } = useQueryBoundModel('page', { defaultValue: 1, asNumber: true })

  const collectionItems = computed<ApiResource[] | undefined>(() => {
    return resource.value?.['hydra:member']
  })

  const totalPages = ref(1)

  function populateCollectionData(resource?: CollectionResourceType) {
    if (resource?.['hydra:member']) {
      const lastPagePath = resource?.['hydra:view']?.['hydra:last']
      if (!lastPagePath) {
        totalPages.value = 1
      }
      else {
        const urlParams = new URLSearchParams(lastPagePath.split('?')[1])
        const pageQueryParam = urlParams.get('page')
        totalPages.value = pageQueryParam ? (parseInt(pageQueryParam) || 1) : 1
      }
    }
  }

  function goToNextPage() {
    if (pageModel.value >= totalPages.value) {
      return
    }
    changePage(pageModel.value + 1)
  }

  function goToPreviousPage() {
    if (!pageModel.value || pageModel.value <= 1) {
      return
    }
    changePage(pageModel.value - 1)
  }

  function changePage(newPageNumber: number) {
    pageModel.value = newPageNumber
  }

  // so components can be loaded in background still for the component manager to get metadata
  if (route) {
    watch(() => route.query, async (newQuery, oldQuery) => {
      const cleanPaginationFromQuery = (q: LocationQuery) => {
        const cleanQuery = { ...q }
        delete cleanQuery.perPage
        delete cleanQuery.page
        return cleanQuery
      }
      const cleanedOld = cleanPaginationFromQuery(oldQuery)
      const cleanedNew = cleanPaginationFromQuery(newQuery)
      if (JSON.stringify(cleanedOld) !== JSON.stringify(cleanedNew)) {
        changePage(1)
      }else if (JSON.stringify(oldQuery) === JSON.stringify(newQuery)) {
        // only cancel if we haven't updated the page, if we have then we should reload trhe collection
        return
      }
      await reloadCollection()
    })
  }

  async function reloadCollection (params = {}) {
    error.value = undefined
    isLoadingCollection.value = true
    const currentFetchId = ++fetchId.value
    if (abortController.value) {
      abortController.value.abort(new DOMException("Cancelled.", "AbortError"))
    }
    abortController.value = new AbortController()
    try {
      resource.value = await $api<CollectionResourceType>(endpoint, {
        params: Object.assign(
          {
            itemsPerPage,
            ...route.query
          },
          params,
          {
            group: true
          }
        ),
        signal: abortController.value.signal
      })
    } catch(e: any) {
      if (!(e instanceof FetchError)) {
        console.error('Unknown error', e)
        error.value = e.message
        return
      }

      if (e.cause instanceof DOMException && e.cause.message === 'Cancelled.') {
        return
      }
      error.value = e.message
    } finally {
      if (currentFetchId === fetchId.value) {
        isLoadingCollection.value = false
        latestSuccessFetchId.value = currentFetchId
      }
    }
  }

  watch(resource, () => {
    populateCollectionData(resource.value)
  })

  onMounted(async () => {
    await reloadCollection()
  })

  return {
    resource,
    collectionItems,
    isLoadingCollection,
    pageModel,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    changePage,
    error,
    reloadCollection,
    latestSuccessFetchId
  }
}
