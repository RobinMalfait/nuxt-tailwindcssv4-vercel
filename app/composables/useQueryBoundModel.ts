import { type LocationQueryRaw, type LocationQueryValueRaw, useRoute } from "#vue-router";
import {computed, ref, type WatchHandle} from "vue";
import {debounce, type DebouncedFunc} from "lodash-es";
import {useQueryState} from "~/composables/useQueryState";

type ModelOps = {
  defaultValue?: any
  delay?: number
  asNumber?: boolean
}

type QueryParamType = MaybeRef<string | string[]>

type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never;

function getNormalisedParams (params: QueryParamType): Ref<string[]> {
  let p = isRef(params) ? params.value : params
  if (!Array.isArray(p)) {
    p = [p]
  }
  return ref(p)
}

function getParamMatchRegExp (param: string) {
  const expParam = param.replace(/[-[\]{}()*+?.,\\^$|]/g, "\\$&")
  return new RegExp(`^${expParam}(?:\\[([a-zA-Z0-9]+)\])?$`, 'i')
}

function createResumableWatcher(watchFnArgs: ArgumentTypes<typeof watch>, ops: { immediate?: boolean } = { immediate: true }) {
  let stopFn: WatchHandle|undefined
  function start() {
    stopFn = watch(...watchFnArgs)
  }

  function stop() {
    if (stopFn) {
      stopFn()
      stopFn = undefined
    }
  }

  if (ops.immediate === true) start()

  return {
    start,
    stop
  }
}

/**
 * Description: This composable creates a Vue model with a 2 way binding to querystring property/properties
 *  1. can be bound to multiple query string parameters
 *  2. query string parameters may change
 *  3. if the querystring updates, we need to watch and update the model
 *  4. if the model changes we need to update the querystring
 *  5. when the query is being updated it is a promise. should keys and values be updated at the same time, consider this
 */
export const useQueryBoundModel = (params: QueryParamType, ops?: ModelOps) => {
  const route = useRoute()
  const queryState = useQueryState()

  let updateQueryFromModelDebouncedFn: DebouncedFunc<() => Promise<void>>|undefined

  const paramsRef = getNormalisedParams(params)
  if (isRef(params)) {
    watch(params, (newParams) => {
      paramsRef.value = getNormalisedParams(newParams).value
    })
  }
  const model = ref(ops?.defaultValue)
  const exposedModel = computed({
    get() {
      return model.value === undefined ? ops?.defaultValue : model.value
    },
    set(newValue) {
      model.value = newValue
    }
  })

  const currentRouteQueryParams = (p: string[]|undefined = undefined) => {
    if (!route) {
      return {
        firstMatch: undefined,
        foundParams: []
      }
    }

    const params = p ? p : paramsRef.value

    const currentRouteQuery = queryState.value
    const allQueryParams = Object.keys(currentRouteQuery)

    let firstMatch: undefined|string
    const foundParams: string[] = []
    for (const p of params) {
      const exp = getParamMatchRegExp(p)
      const matchingParams = allQueryParams.filter(param => exp.test(param))
      if (matchingParams.length) {
        if (!firstMatch) firstMatch = p
        foundParams.push(...matchingParams)
      }
    }

    return {
      firstMatch,
      foundParams
    }
  }

  const valueFromQuery = computed(() => {
    const currentExistingRouteQueryParams = currentRouteQueryParams().foundParams
    if (!currentExistingRouteQueryParams.length) {
      return
    }

    const normalizeValue = (value: LocationQueryValueRaw | LocationQueryValueRaw[], isArray: boolean) => {
      if (Array.isArray(value)) {
        return value
      }
      if (isArray) {
        return [value]
      }
      return (ops?.asNumber && value !== null) ? Number(value) : value
    }

    const currentRouteQuery = queryState.value

    // loop through the parameters this model is bound to
    // return the first result found, if bound to multiple query params, they should all match this model
    for (const p of paramsRef.value) {
      const isBoundToArray = p.endsWith('[]')
      if (currentRouteQuery[p]) {
        return normalizeValue(currentRouteQuery[p], isBoundToArray)
      }
    }

    const firstMatchingExistingParam = currentExistingRouteQueryParams[0]
    const firstMatchParam = currentRouteQueryParams().firstMatch
    if (!firstMatchingExistingParam || !firstMatchParam) {
      return
    }

    const matches = firstMatchingExistingParam.match(getParamMatchRegExp(firstMatchParam))
    if (!matches || matches.length < 2) {
      return
    }

    const matchingObjectKey = matches[1]
    if (matchingObjectKey) {
      return { [matchingObjectKey]: queryState.value[firstMatchingExistingParam[0]] }
    }
  })

  // update the model initial value form default to what it is in the route query
  if (valueFromQuery.value) {
    model.value = valueFromQuery.value
  }

  // binding the query to the local models
  const { start: startWatchingQuery, stop: stopWatchingQuery } = createResumableWatcher(
    [
      valueFromQuery,
      (newQueryValue, oldV) => {
        // update the model to match the new query value
        model.value = newQueryValue
      },
      {
        flush: 'post'
      }
    ],
    { immediate: true }
  )

  const getBaseQuery = (newParams: string[], oldParams: undefined|string[]): LocationQueryRaw => {
    const currentRouteQuery = queryState.value
    const isParamsUpdated = newParams !== oldParams
    return Object.keys(currentRouteQuery)
      .filter(key => {
        if (newParams && currentRouteQueryParams(newParams).foundParams.includes(key)) {
          return false
        }
        if (!isParamsUpdated) {
          return true
        }
        return !currentRouteQueryParams(oldParams).foundParams.includes(key);
      })
      .reduce((obj, key) => {
        return {
          ...obj,
          [key]: currentRouteQuery[key]
        };
      }, {})
  }

  // binding the model value and query parameters to the route query
  watch([model, paramsRef], async ([newModel, newParams], [oldModel, oldParams]) => {
    const isModelUpdated = JSON.stringify(newModel) !== JSON.stringify(oldModel)
    const isParamsUpdated = newParams !== oldParams
    stopWatchingQuery()

    if (isModelUpdated && updateQueryFromModelDebouncedFn) {
      updateQueryFromModelDebouncedFn.cancel()
    }

    const newParamsQuery: LocationQueryRaw = {}
    const newDataQuery: LocationQueryRaw = {}

    const isNewValueObject = Object.prototype.toString.call(newModel) === '[object Object]'
    if (isNewValueObject) {
      for (const newValueKey of Object.keys(newModel)) {
        const objectParamValueNew = newModel[newValueKey]
        const objectParamValueOld = oldModel?.[newValueKey]
        if (!objectParamValueOld && !objectParamValueNew) {
          continue
        }
        // update the new query to include the query parameters and values
        for (const p of newParams) {
          newParamsQuery[`${p}[${newValueKey}]`] = objectParamValueOld
          newDataQuery[`${p}[${newValueKey}]`] = objectParamValueNew
        }
      }
    } else {
      for (const p of newParams) {
        newParamsQuery[p] = newModel
        newDataQuery[p] = newModel
      }
    }

    if (isParamsUpdated) {
      // update immediately if we are changing the parameters with whatever the old data was
      // we are debouncing the update of any new values
      queryState.value = { ...getBaseQuery(newParams, oldParams), ...newParamsQuery }
    }

    if (!isModelUpdated) {
      if (!updateQueryFromModelDebouncedFn) startWatchingQuery()
      return
    }

    updateQueryFromModelDebouncedFn = debounce(async () => {
      queryState.value = { ...getBaseQuery(newParams, oldParams), ...newDataQuery }
      updateQueryFromModelDebouncedFn = undefined
      startWatchingQuery()
    }, ops?.delay || 10)
    await updateQueryFromModelDebouncedFn()
  })

  return {
    model: exposedModel
  }
}
