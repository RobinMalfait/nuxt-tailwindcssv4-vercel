<script setup lang="ts">
import {FetchError} from "ofetch";
import ActionButtons from "~/components/Ui/Form/ActionButtons.vue";

const { $api } = useNuxtApp()

const { initialData } = defineProps<{
  initialData: Partial<PartialResource<PaperResource>>
}>()

const emit = defineEmits<{
  close: [],
  success: []
}>()

const newResource: PartialResource<PaperResource> = {
  '@id': '/account/papers/0'
}

const paperTypeOptions = [
  {
    label: 'Pilot & Feasibility Trial',
    value: 'pilot-feasibility'
  },
  {
    label: 'Full-scale RCT',
    value: 'full-scale-rct'
  }
]

const jsonImporting = ref(false)
const fileInput = ref()
const importError = ref<{ detail: string }>()
const resourceRef = ref(newResource)
const file = computed(() => fileInput.value?.files[0])
const { resource: storeResource, getFormInputProps, createResource } = useApiResourceForm<PartialResource<PaperResource>>(resourceRef, 'Paper', initialData)

const isPilot = computed(() => (storeResource.value?.studyType === 'pilot-feasibility'))
const titlePostfix = computed(() => (isPilot.value ? ': a pilot trial' : ''))

function stripPostfix (postfix: string) {
  const regex = new RegExp(`${postfix}$`)
  return (storeResource.value?.title || '').replace(regex, '')
}

watch(titlePostfix, (newPostfix, oldPostfix) => {
  paperTitle.value = stripPostfix(oldPostfix) + newPostfix
})

const paperTitle = computed({
  get() {
    return `${stripPostfix(titlePostfix.value)}${titlePostfix.value}`
  },
  set(newValue: string) {
    if (!storeResource.value) return
    storeResource.value.title = newValue
  }
})

function ensureCaretPosition(event: PointerEvent) {
  const element = event.target
  if (!element || !(element instanceof HTMLTextAreaElement)) return
  const maxCaretPos = element.value.length - titlePostfix.value.length
  if (element.selectionStart > maxCaretPos) {
    element.selectionStart = maxCaretPos
  }
  if (element.selectionEnd > maxCaretPos) {
    element.selectionEnd = maxCaretPos
  }
}

async function addPaper () {
  if(await createResource()) {
    emit('success')
  }
}

async function uploadJson() {
  if (!file.value) return
  jsonImporting.value = true
  importError.value = undefined
  const formData = new FormData()
  formData.append('file', file.value)
  try {
    await $api<PaperResource>('/import-paper', {
      method: 'POST',
      body: formData,
      headers: {
        accept: 'application/json'
      }
    })
    emit('success')
  } catch(error: any) {
    if (!(error instanceof FetchError)) {
      throw error
    }
    console.error(error)
    importError.value = error.data
    fileInput.value.value = ''
  } finally {
    jsonImporting.value = false
  }
}
</script>

<template>
  <div v-if="storeResource">
    <ApiResourceFormRadioInput
      :input-props="{ options: paperTypeOptions }"
      v-bind="getFormInputProps('studyType', { label: 'Study type' })"
      v-model="storeResource.studyType"
    />
    <ApiResourceFormTextarea
      :input-props="{
        attr: { placeholder: '' }
      }"
      v-bind="getFormInputProps('title', {
        label: 'Paper title'
      })"
      v-model="paperTitle"
      @focus="ensureCaretPosition"
      @keyup="ensureCaretPosition"
      @keydown="ensureCaretPosition"
      @click="ensureCaretPosition"
    />
    <ActionButtons
      class="w-full mt-3 sm:mt-0"
      :action="addPaper"
      button-text="Add"
      @close="emit('close')"
    >
      <template #extraAction>
        <div class="file json-file text-nowrap" :class="[jsonImporting ? 'opacity-50' : 'opacity-100']">
          <label for="file-upload" class="py-1 px-0.5 relative cursor-pointer rounded-sm bg-white font-semibold text-primary ring-offset-4 ring-1 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary">
            <span class="">Import JSON</span>
            <input
              id="file-upload"
              name="file-upload"
              ref="fileInput"
              class="sr-only"
              type="file"
              accept="application/json,application/ld+json,.json"
              @input="uploadJson"
            />
          </label>
        </div>
      </template>
    </ActionButtons>

    <div v-if="importError" class="mt-2 text-white bg-danger/90 rounded-md py-1 px-2 text-sm">
      <span class="font-bold">Import error:</span> {{ importError.detail }}
    </div>
  </div>
</template>
