import {FetchError} from "ofetch";
import type {FieldInputStatus} from "~/components/Ui/Form/FieldStatusIcon.vue";


export type ApiFormData = {
  vars: {
    [key: string]: any
  },
  children: ApiFormData[]
}

export type ApiFormResponse = {
  form: ApiFormData
}

export type InputDataType = {
  children: {
    [inputName: string]: InputDataType
  },
  _vars: {
    [key: string]: any
  },
  status: FieldInputStatus|null
}

type InputDataSetType = {
  [inputName: string]: InputDataType
}

export async function useApiForm (formIri: string, formPrefix:string, submitPath?: string) {
  const formSubmitSuccess = ref(false)
  const fullFormSubmitted = ref(false)
  const { $api } = useNuxtApp()
  const { data } = await useApiFetch<ApiFormResponse>(formIri)
  if (!data.value) {
    throw Error(`No data received for the form (${formIri})`)
  }

  const submitBody = reactive<{ [key: string]: any }>({})
  const formData = ref<ApiFormResponse>(data.value)
  const response = ref()
  const submitting = ref(false)
  const requestError = ref<FetchError<any>>()
  const apiSubmitPath = submitPath || formIri + '/submit'

  function splitPathParts (path: string) {
    return path.replace(/\[]$/, "").split(/\[(.*?)]/).filter(String)
  }

  function getInputNameNestedPath (inputName: string, formPrefix?: string) {
    const prefixNameParts = splitPathParts(inputName)
    let fullNamePath = ""
    const fullPath: string[] = []
    prefixNameParts.forEach((namePart) => {
      fullNamePath += fullNamePath !== "" ? `[${namePart}]` : namePart
      if (fullNamePath === formPrefix) return
      if (fullPath.length) fullPath.push("children")
      fullPath.push(fullNamePath)
    })
    return fullPath
  }

  const initInput = (vars: { full_name: string, value?: any }) => {
    const path = splitPathParts(vars.full_name)
    if (_get(submitBody, path, null)) {
      return
    }
    _set(submitBody, path, vars.value)
  }

  const getNestedInput = (inputName: string) => {
    const OBJECT_PATH = getInputNameNestedPath(inputName, formPrefix);
    return _get(parsedFormData.value, OBJECT_PATH, null)
  }

  const getFormFieldProps = (inputName: string) => {
    const inputData = getNestedInput(inputName)
    return {
      inputData,
      inputName,
      submitBody,
      submitPath: formIri + '/submit',
      disabled: submitting.value
    }
  }

  function parseFormChildren (children: any[]) {
    return children.reduce((obj, value) => {
      const newObj: InputDataType = { children: {}, _vars: value.vars, status: null }
      if (value.children) {
        newObj.children = parseFormChildren(value.children)
      }
      return { ...obj, [value.vars.full_name]: newObj }
    }, {})
  }

  const parseFormData = () => {
    const children = formData.value?.form?.children
    return children ? parseFormChildren(children) : undefined
  }

  const parsedFormData = ref<InputDataSetType|undefined>(parseFormData())

  const inputNames = computed<string[]>(() => {

    return parsedFormData.value ? Object.keys(parsedFormData.value) : []
  })

  function initChildFields (children: any[]) {
    for (const child of children) {
      if (child.vars.full_name) {
        initInput(child.vars)
      }
      if (child.children) {
        initChildFields(child.children)
      }
    }
  }

  function initFormData () {
    const children = formData.value?.form?.children
    if (children) {
      initChildFields(children)
    }
  }

  async function submitForm () {
    formSubmitSuccess.value = false
    requestError.value = undefined
    submitting.value = true
    try {
      const $fn = submitPath ? $fetch.create({ headers: {
        'content-type': 'application/json'
      }}) : $api
      response.value = await $fn<ApiFormResponse>(apiSubmitPath, {
        method: 'post',
        body: submitBody
      })
      if(response.value.form) formData.value = response.value
      formSubmitSuccess.value = true
    } catch (error: any) {
      if (!(error instanceof FetchError)) {
        throw error
      }
      if (error.statusCode !== 400 || !error.data?.form) {
        requestError.value = error
      } else {
        formData.value = error.data
        parsedFormData.value = parseFormData()
      }
    } finally {
      fullFormSubmitted.value = true
      submitting.value = false
    }
  }

  const formErrorMessage = computed(() => {
    const responseData = requestError.value?.data
    if (!responseData) {
      return
    }
    return JSON.stringify(responseData)
  })

  function updateFormData(fieldName: string, form: ApiFormData, status: FieldInputStatus) {
    const inputData = getNestedInput(fieldName)
    inputData._vars = form.vars
    inputData.status = status
    if (!form.children) {
      return
    }
    for (const child of form.children) {
      updateFormData(child.vars.full_name, child, status)
    }
  }

  initFormData()

  return {
    getFormFieldProps,
    submitForm,
    formErrorMessage,
    submitting,
    submitBody,
    inputNames,
    updateFormData,
    parsedFormData ,
    formSubmitSuccess,
    response,
    formData: computed(() => formData.value),
    fullFormSubmitted
  }
}
