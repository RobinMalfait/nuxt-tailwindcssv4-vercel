import type {RouteLocationRaw} from "#vue-router";

export const useWizardDrawerPage = () => {
  const isOpen = ref(true)

  const route = useRoute()

  function getMatchableRoute(route: RouteLocationRaw) {
    if (typeof route === 'string') return route
    return JSON.stringify({
      name: "name" in route ? route.name : route,
      params: "params" in route ? route?.params : undefined
    })
  }

  function goToParentPage() {
    const routeAtChangeTime = getMatchableRoute(route)
    const parentRoute = route.matched[route.matched.length - 2]
    isOpen.value = false
    if (!parentRoute) return
    setTimeout(() => {
      if (getMatchableRoute(route) !== routeAtChangeTime) return
      navigateTo({
        name: parentRoute.name,
        params: {
          paperId: route.params.paperId
        }
      })
    }, 510)
  }

  return {
    isOpen,
    goToParentPage
  }
}
