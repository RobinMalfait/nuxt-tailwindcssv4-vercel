<template>
  <PageContainer size="narrow" class="flex flex-col gap-y-6">
    <UiTitle ref="scrollToElement">Your Papers</UiTitle>
    <div class="flex gap-x-3 items-center">
      <div>
        <CtaButton @click="showAddModal = true">Add New Paper</CtaButton>
      </div>
      <div class="flex-grow min-w-0">
        <UiFormFieldInput v-model="searchModel" :attr="{ placeholder: 'Search' }" />
      </div>
      <div>
        <UiFormFieldSelect v-model="sortByModel" :options="sortByOptions" />
      </div>
    </div>

    <div class="relative min-h-56">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div v-if="isLoadingCollection" class="absolute -inset-1 flex justify-center bg-white/80 z-50 pointer-events-none">
          <div class="relative w-1/12 max-w-10 text-primary py-20">
            <UiSpinner class="w-full" />
          </div>
        </div>
      </Transition>
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
        mode="out-in"
      >
        <div v-if="error" class="justify-center flex" key="fetch-error">
          <UiNotification type="error">
            <h2>
              Sorry an error occurred:<br><span class="font-semibold">{{ error }}</span>
            </h2>
          </UiNotification>
        </div>
        <div v-else-if="collectionItems?.length" :key="latestSuccessFetchId">
          <div class="flex flex-col gap-y-6">
            <PaperCard v-for="paper of collectionItems" :key="paper['@id']" :paper="paper" />
          </div>
        </div>
        <template v-else-if="!isLoadingCollection && !collectionItems?.length && !error">
          <UiNoItemsFound v-if="searchModel" />
          <LazyUiAddYourFirstPrompt v-else item-name="paper" />
        </template>
      </Transition>
      <UiPagination
        v-if="totalPages > 1"
        class="mt-2"
        :items-per-page="itemsPerPage"
        :current-page="pageModel"
        :total-pages="totalPages"
        :total-items="resource?.['hydra:totalItems'] || 0"
        @next="goToNextPage"
        @previous="goToPreviousPage"
        @change="changePage"
      />
    </div>
    <Teleport to="body">
      <LazyUiModal
        :open="showAddModal"
        @close="showAddModal = false"
        title="New Paper"
      >
        <PaperNewPaperForm
          :initial-data="{ user: userData?.user?.['@id'] }"
          @close="showAddModal = false"
          @success="newPaperSuccess"
        />
      </LazyUiModal>
    </Teleport>
  </PageContainer>
</template>

<script lang="ts" setup>
import CtaButton from "~/components/Ui/CtaButton.vue";

type SortOptionType = {
  label: string
  value: {
    queryKey: string
    queryValue: string
  }
}

const { userData } = usePatUserSession()
const showAddModal = ref(false)
const sortByOptions = ref<SortOptionType[]>([
  {
    label: 'Created (ascending)',
    value: {
      queryKey: 'order[created]',
      queryValue: 'asc'
    }
  },
  {
    label: 'Created (descending)',
    value: {
      queryKey: 'order[created]',
      queryValue: 'desc'
    }
  },
  {
    label: 'Modified (ascending)',
    value: {
      queryKey: 'order[modified]',
      queryValue: 'asc'
    }
  },
  {
    label: 'Modified (descending)',
    value: {
      queryKey: 'order[modified]',
      queryValue: 'desc'
    }
  },
  {
    label: 'Title (A-Z)',
    value: {
      queryKey: 'order[title]',
      queryValue: 'asc'
    }
  },
  {
    label: 'Title (Z-A)',
    value: {
      queryKey: 'order[title]',
      queryValue: 'desc'
    }
  }
])

const route = useRoute()

function findInitOption (): SortOptionType {
  const matchedOption = sortByOptions.value.filter(op => {
    return !!route.query[op.value.queryKey] && route.query[op.value.queryKey] === op.value.queryValue
  })
  return matchedOption?.[0] || sortByOptions.value[0]
}

const currentOption: SortOptionType = findInitOption()
const sortByParameter = ref(currentOption.value.queryKey)
const sortByModel = ref<SortOptionType['value']>(currentOption.value)

const { model: sortByQueryModel } = useQueryBoundModel(sortByParameter)
const { model: searchModel } = useQueryBoundModel(['title', 'searchTitle', 'paperAuthors.firstName', 'paperAuthors.lastName'], {
  delay: 150
})

const scrollToElement = ref()
const itemsPerPage = 5

const { public: { papersEndpoint } } = useRuntimeConfig()
const {
  resource,
  collectionItems,
  error,
  isLoadingCollection,
  totalPages,
  pageModel,
  goToNextPage,
  goToPreviousPage,
  changePage,
  latestSuccessFetchId,
  reloadCollection
} = useCollectionResource(papersEndpoint, itemsPerPage)

watch(() => (collectionItems.value?.[0]?.['@id']), () => {
  scrollToElement.value.$el.scrollIntoView({ behavior: 'smooth'})
})

watch(sortByModel, (newValue) => {
  sortByParameter.value = newValue.queryKey
  sortByQueryModel.value = newValue.queryValue
})

watch(sortByQueryModel, (newModel) => {
  if (newModel === undefined) {
    const currentOption: SortOptionType = findInitOption()
    sortByParameter.value = currentOption.value.queryKey
    sortByModel.value = currentOption.value
  }
})

async function newPaperSuccess () {
  showAddModal.value = false
  await reloadCollection()
}
</script>
