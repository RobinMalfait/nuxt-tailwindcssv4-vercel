import type {LocationQueryRaw} from "#vue-router";

/*
We need a common state for the query used by the useQueryBoundModel because updating the current route is async
So as we calculate the new query, if we are using the current router.route, it may be out of date if 2 models
are being updated simultaneously.

For this purpose it only needs to have1  way binding and the query models will watch the route and update their own models
 */
export const useQueryState = () => {
  return useState<LocationQueryRaw>('queryBoundQuery')
}
