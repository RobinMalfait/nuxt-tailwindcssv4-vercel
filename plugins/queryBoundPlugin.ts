import type {LocationQueryRaw} from "#vue-router";

export default defineNuxtPlugin(nuxtApp => {

  const route = useRoute()
  const router = useRouter()
  const updatingQuery =  useState<boolean>('updatingQuery', () => false)
  const queryState = useState<LocationQueryRaw>('queryBoundQuery', () => route.query)

  watch(queryState, async (newQuery) => {
    if (JSON.stringify(newQuery) === JSON.stringify(route.query)) return
    updatingQuery.value = true
    await router.replace({ query: newQuery })
    updatingQuery.value = false
  })

  watch(() => route.query, (newQuery) => {
    if (!updatingQuery.value && JSON.stringify(newQuery) !== JSON.stringify(queryState.value)) {
      queryState.value = newQuery
    }
  })
})
