<script lang="ts" setup generic="T extends ApiResource">
import CtaButton from "~/components/Ui/CtaButton.vue";
import ActionButtons from "~/components/Ui/Form/ActionButtons.vue";
import type {ValidationViolation} from "~/stores/paperValidationStore";
import type {NuxtLinkProps} from "#app/components/nuxt-link";
import ResourceListCard from "~/components/Ui/Wizard/ResourceListCard.vue";

const resources = defineModel<T[]>({
  required: true
})

const emit = defineEmits<{
  reload: []
}>()

defineSlots<{
  top: () => any,
  card: (props: { deleteFn: () => void, resource: T, index: number }) => any
  add: (props: { closeFn: typeof closeAddModal, clearAndCloseFn: typeof clearAndClose }) => any
  'card-footer': (props: { resource: T, index: number }) => any
}>()

const { resourceTitleProperty = 'name', resourceName, endpoint, initialData, validationProperty, validationFields } = defineProps<{
  resourceName: string
  endpoint: `/${string}`
  isLoading?: boolean
  resourceTitleProperty?: string
  initialData?: Partial<T>
  hideAdd?: boolean
  validationProperty?: string
  validationFields?: string[]
  getCardRouteFn?: (resource: T) => NuxtLinkProps|undefined|void
  cardClickFn?: (resource: T) => void
}>()

const { $api } = useNuxtApp()

const showAddModal = ref(false)
const deleteResource = ref<T>()
const showDeleteModal = ref(false)

const resourceNameCapitalised = computed(() => {
  return resourceName.charAt(0).toUpperCase() + resourceName.slice(1)
})
const newResourceIri = computed<T['@id']>(() => (`${endpoint}/0`))


function confirmDelete(iri: T) {
  deleteResource.value = iri
  showDeleteModal.value = true
}

async function doDelete() {
  if (!deleteResource.value || !showDeleteModal.value) {
    return
  }
  try {
    await $api(deleteResource.value['@id'], {
      method: 'DELETE'
    })
    closeDeleteModal()
    emit('reload')
  } catch (error: any) {
    console.error(error)
  }
}

function closeDeleteModal () {
  showDeleteModal.value = false
}

function closeAddModal () {
  showAddModal.value = false
}

function clearAndClose () {
  emit('reload')
  closeAddModal()
  // reset the resource in the modal
  resourceStore.saveResource(resourceBase.value)
  initApiResource(true)
}

const resourceBase: Ref<PartialResource<T>> = ref({
  '@id': newResourceIri.value
})

const { createResource, init: initApiResource } = useApiResourceForm<T>(resourceBase, undefined, initialData)
const resourceStore = useApiResourcesStore()
const paperValidationStore = usePaperValidationStore()

async function addResource () {
  const createSuccess = await createResource()
  if(!createSuccess) return false

  clearAndClose()
  return true
}

function getValidationPaths (index: number) {
  if (!validationProperty) return
  const baseValidationField = `${validationProperty}[${index}]`
  if (!validationFields) {
    return [baseValidationField]
  }
  const allPaths: string[] = []
  for (const vField of validationFields) {
    allPaths.push(`${baseValidationField}.${vField}`)
  }
  return allPaths
}

function matchPropertyPath (violation: ValidationViolation, vPath: string, exact?: boolean) {
  return exact
    ? violation.propertyPath === vPath
    : violation.propertyPath.startsWith(vPath)
}

const hasValidationErrors = computed(() => {
  return (index: number, exact?: boolean) => {
    if (!paperValidationStore.currentPaperValidation) return false

    const validationPaths = getValidationPaths(index)
    if (!validationPaths) return false

    for (const violation of paperValidationStore.currentPaperValidation.violationList.violations) {
      for (const vPath of validationPaths) {
        if (matchPropertyPath(violation, vPath, exact)) {
          return true
        }
      }
    }
    return false
  }
})

const getCardValidationErrors = computed(() => {
  return (index: number, exact?: boolean) => {
    const errors: ValidationViolation[] = []
    if (!paperValidationStore.currentPaperValidation) return errors

    const validationPaths = getValidationPaths(index)
    if (!validationPaths) return errors

    for (const violation of paperValidationStore.currentPaperValidation.violationList.violations) {
      for (const vPath of validationPaths) {
        if (matchPropertyPath(violation, vPath, exact)) {
          errors.push(violation)
        }
      }
    }
    return errors
  }
})

</script>

<template>
  <div class="flex flex-col gap-y-4" :class="isLoading ? ['opacity-50', 'pointer-events-none'] : []">
    <div class="flex gap-x-4 items-end">
      <div>
        <CtaButton @click="showAddModal = true">Add {{ resourceNameCapitalised }}</CtaButton>
      </div>
      <div class="flex-grow">
        <slot name="top" />
      </div>
    </div>

    <LazyUiAddYourFirstPrompt v-if="!isLoading && !resources.length" :item-name="resourceName" />

    <ResourceListCard
      v-for="(resource, resourceIndex) of resources"
      :key="'resource-list-item-' + resource['@id']"
      :resource="resource"
      :has-warning="hasValidationErrors(resourceIndex)"
      :link-props="getCardRouteFn ? getCardRouteFn(resource) || undefined : undefined"
      :is-button="!!cardClickFn"
      @click="() => (cardClickFn ? cardClickFn(resource) : undefined)"
      @delete="() => { confirmDelete(resource) }"
    >
      <template #card="{ resource }">
        <slot name="card" :deleteFn="() => { confirmDelete(resource) }" :resource="resource" :index="resourceIndex" />
      </template>
      <template #card-footer="{ resource }">
        <slot name="card-footer" :resource="resource" :index="resourceIndex">
          <span class="text-xs text-gray-400">created: {{ formatDate(resource.created) }}</span>
        </slot>
      </template>
    </ResourceListCard>

    <LazyUiModal
      :open="showAddModal"
      @close="showAddModal = false"
      :title="`Add ${resourceNameCapitalised}`"
      quick-close
    >
      <form @submit.prevent="addResource">
        <slot name="add" :closeFn="closeAddModal" :clear-and-close-fn="clearAndClose" />
        <div v-if="!hideAdd" class="flex flex-col-reverse sm:flex-row mt-4 sm:gap-x-6 items-center">
          <ActionButtons
            class="w-full mt-3 sm:mt-0"
            :action="addResource"
            button-text="Add"
            @close="closeAddModal"
          />
        </div>
      </form>
    </LazyUiModal>

    <LazyUiModalConfirmDanger
      title="Are you sure?"
      :button-text="`Delete ${resourceNameCapitalised}`"
      :action="doDelete"
      :open="showDeleteModal"
      @close="closeDeleteModal"
    >
      <div class="prose">
        <p>This will delete the {{ resourceName }} <span class="font-semibold">{{ deleteResource?.[resourceTitleProperty] }}</span>.</p>
        <p class="text-danger font-semibold">You will not be able to un-do this action</p>
      </div>
    </LazyUiModalConfirmDanger>
  </div>
</template>
