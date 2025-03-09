import {defineStore} from "pinia";
import {computed} from "vue";
import {useNuxtApp} from "#app";
import {FetchError} from "ofetch";
import {watchThrottled} from "@vueuse/core";

export type ValidationViolation = {
  code: null|number
  iri: string
  message: string
  objectPath: null|string
  property: string
  propertyPath: string
}

type ViolationMetadatum = {
  classConstraints: string[]
  className: string
  classViolations: boolean
  minimumCount: number
  propertyViolations: {
    [property: string]: boolean
  }
  uses: number
}

type ViolationMetadata = {
  [cls: string]: ViolationMetadatum
}

type ValidationResponseType = {
  '@type': 'PaperStatus'
  violationList: {
    violations: ValidationViolation[]
  }
  metadata: ViolationMetadata
}
type PaperValidationType = { [iri: string]: ValidationResponseType|undefined }

function getValidationDataByField(
  validateField: string,
  validationData: ViolationMetadata
): { data: ViolationMetadatum; field?: string } | null {
  const getRetObj = (data: ViolationMetadatum, field?: string) => {
    if (
      field &&
      field !== '*' &&
      data.propertyViolations[field] === undefined
    ) {
      console.log(
        `Could not find the field '${field}' in the validation object`,
        data
      )
      return null
    }
    if (!field) {
      return { data }
    }
    return { data, field }
  }

  const validationResultEntity = validationData[validateField]
  if (validationResultEntity) {
    return getRetObj(validationResultEntity)
  }

  const lastIndex = validateField.lastIndexOf('.')
  if (lastIndex === -1) {
    const vObj = validationData.Paper
    return getRetObj(vObj, validateField)
  }
  const objKey = validateField.slice(0, lastIndex)
  const vObj = validationData[objKey]
  if (!vObj) {
    console.warn(
      `Could not find the object validation object '${objKey}' derived from the field '${validateField}' - not found`
    )
    return null
  }
  return getRetObj(vObj, validateField.slice(lastIndex + 1))
}

export const usePaperValidationStore = defineStore('paper-validation', () => {
  const paperValidation = ref<PaperValidationType>({})
  const { $api } = useNuxtApp()
  const currentIri = ref()
  const apiResourcesStore = useApiResourcesStore()
  const { byId: resourcesById } = storeToRefs(apiResourcesStore)

  async function refreshPaperValidation(paperIri?: PaperResource['@id']) {
    if (paperIri) {
      paperValidation.value[paperIri] = undefined
    }

    if (!paperIri) paperIri = currentIri.value
    if (!paperIri) return
    try {
      paperValidation.value[paperIri] = await $api<ValidationResponseType>(`${paperIri}/status`, {
        cache: 'no-cache',
      })
    } catch (error: any) {
      if (!(error instanceof FetchError)) {
        throw error
      }
      console.error(error)
    } finally {
      currentIri.value = paperIri
    }
  }

  const fieldErrorCount = computed(() => {
    return (fields: string[]) => {
      let counter: number = 0
      const currentValidationMetadata = paperValidation.value[currentIri.value]?.metadata
      if (!currentValidationMetadata) return counter

      for (const validateField of fields) {
        const validationResultEntity = getValidationDataByField(validateField, currentValidationMetadata)
        if (validationResultEntity === null) continue

        const vObj = validationResultEntity.data

        const missingUses = vObj.minimumCount - vObj.uses
        if (missingUses > 0) {
          // for however many uses of this entity we are missing, add this as a missing field, no need to count
          // how many fields will be missing, for now it is incomplete by this many missing entities
          counter += missingUses
        }

        // no matter how many violations there are on the class level, we add 1
        // this is because we don't have all the data
        if (vObj.classViolations) counter++

        const field = validationResultEntity.field
        if (!field) continue

        const isFieldWildcard = field === '*'
        if (!isFieldWildcard) {
          if (vObj.propertyViolations[field]) counter++
        } else {
          counter += Object.values(vObj.propertyViolations).filter(Boolean).length
        }
      }

      return counter
    }
  })

  const areFieldsComplete = computed(() => {
    return (fields: string[]) => {
      const currentValidationMetadata = paperValidation.value[currentIri.value]?.metadata
      if (!currentValidationMetadata) return undefined

      for (const validateField of fields) {
        const validationResultEntity = getValidationDataByField(validateField, currentValidationMetadata)
        if (validationResultEntity === null) continue

        const vObj = validationResultEntity.data
        if (vObj.classViolations || vObj.uses < vObj.minimumCount) {
          return false
        }

        const field = validationResultEntity.field
        if (!field) continue

        const isFieldWildcard = field === '*'

        if (isFieldWildcard) {
          // if any properties are invalid then the object is invalid
          if (Object.values(vObj.propertyViolations).includes(true)) {
            return false
          }
        } else if (vObj.propertyViolations[field]) {
          return false
        }
      }

      return true
    }
  })

  const validationLoaded = computed(() => {
    return paperValidation.value[currentIri.value] !== undefined
  })

  watchThrottled(resourcesById, async () => {
    await refreshPaperValidation()
  }, {
    throttle: 3000,
    deep: true
  })

  const currentPaperValidation = computed(() => paperValidation.value?.[currentIri.value])
  const currentViolationsByIri = computed(() => {
    if (!currentPaperValidation.value) return {}

    return currentPaperValidation.value.violationList.violations.reduce((obj, v) => {
      if (!obj[v.iri]) {
        obj[v.iri] = []
      }
      obj[v.iri].push(v)
      return obj
    }, {} as { [iri: string]: ValidationViolation[] })
  })

  return {
    refreshPaperValidation,
    currentPaperValidation,
    paperValidation: computed(() => paperValidation.value),
    areFieldsComplete,
    fieldErrorCount,
    validationLoaded,
    currentViolationsByIri
  }
})
