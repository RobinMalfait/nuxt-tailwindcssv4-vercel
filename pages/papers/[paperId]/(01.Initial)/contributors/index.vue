<script setup lang="ts">
import {useNuxtApp} from "#app";
import CtaButton from "~/components/Ui/CtaButton.vue";
import type {NuxtLinkProps} from "#app/components/nuxt-link";
import {useApiResourceForm} from "~/composables/useApiResourceForm";
import type {SelectOption} from "~/components/Ui/Form/FieldSelect.vue";

const route = useRoute()
const { $api } = useNuxtApp()

definePageMeta({
  name: 'contributors'
})

const { paper } = defineProps<{
  paper: PaperResource
}>()

const { getFormInputProps, resource: storeResource } = useApiResourceForm(ref(paper), 'Paper')
const resourcesStore = useApiResourcesStore()

const endpoint = '/account/paper_authors'
const contributors = ref<ApiResource[]>([])
const isLoading = ref(false)
const addContributor = ref()
const correspondingAuthorSelect = ref()

const authorOptions = computed<SelectOption[]>(() => {
  return contributors.value
    .map(c => (resourcesStore.getResource(c['@id']).value || c))
    .filter(c => c.role === 'author')
    .map(c => ({
      label: `${c.firstName} ${c.lastName}`,
      value: c['@id']
    }))
})

function validateSelectedCorrespondingAuthor () {
  const ca = storeResource.value.correspondingAuthor
  if (!ca) return
  if (!correspondingAuthorSelect.value) return
  if (!authorOptions.value.map(o => o.value).includes(ca)) {
    correspondingAuthorSelect.value.updateValue(null)
  }
}

const hideModalAddButton = computed(() => {
  return addContributor.value?.hideModalAdd
})

function setAddContributorRef(el: Element|ComponentPublicInstance|null) {
  addContributor.value = el
}

async function refresh() {
  isLoading.value = true
  try {
     const collection = await $api<ApiResource>(endpoint, {
      query: {
        paper: paper['@id']
      }
    })
    contributors.value = collection['hydra:member']
    validateSelectedCorrespondingAuthor()
  } finally {
    isLoading.value = false
  }
}

watch(authorOptions, validateSelectedCorrespondingAuthor)

function getCardRoute(resource: ApiResource): NuxtLinkProps {
  return {
    to: {
      name: 'contributor-item',
      params: {
        paperId: route.params.paperId,
        iri: resource['@id']
      }
    }
  }
}

onMounted(async () => {
  await refresh()
})
</script>
<template>
  <PageSection>
    <PageContainer>
      <div class="flex flex-col gap-y-8">
        <UiPageIntro title="Contributors" text="This wizard imports information from user account details. If contributors are not registered on PAT you will have an option to invite them." />

        <div class="flex">
          <div class="w-xl flex flex-col gap-y-8">
            <UiCard>
              <ApiResourceFormSelect
                ref="correspondingAuthorSelect"
                :input-props="{
                  attr: { placeholder: authorOptions.length ? 'Select Corresponding Author' : 'Please add an author first' }
                }"
                v-bind="getFormInputProps('correspondingAuthor', {
                  label: 'Corresponding Author'
                })"
                :options="authorOptions"
                v-model="storeResource.correspondingAuthor"
              />
            </UiCard>

            <div class="ml-0">
              <UiWizardResourceList
                v-model="contributors"
                resource-name="contributor"
                endpoint="/account/paper_authors"
                validation-property="paperAuthors"
                :is-loading="isLoading"
                :initial-data="{ paper: paper['@id'] }"
                :hide-add="hideModalAddButton"
                :get-card-route-fn="getCardRoute"
                @reload="refresh"
              >
                <template #top>
                </template>

                <template #add="{ clearAndCloseFn }">
                  <ContributorAddContributor :ref="(el) => setAddContributorRef(el)" :paper="paper" @clearAndClose="clearAndCloseFn" />
                </template>
                <template #card="{ resource }">
                  <div class="flex items-center">
                    <div class="flex-grow min-w-0">
                      <h2 class="font-semibold text-lg md:text-xl">
                        {{ resource.firstName }} {{ resource.lastName }}
                      </h2>
                      <h3 v-if="resource.role" class="text-primary capitalize">
                        {{ resource.role }}
                      </h3>
                    </div>
                    <div class="pl-4 leading-0 block">
                      <Icon name="heroicons-solid:arrow-right" class="!size-6 text-primary block" />
                    </div>
                  </div>
                </template>
                <template #card-footer="{ index }" v-if="contributors.length > 1">
                  <div class="inline-flex justify-start gap-x-2">
                    <div>
                      <CtaButton preset="blue-outline" class="text-xs" :disabled="index === 0">
                        <Icon name="ph:caret-up-fill" class="!size-4 text-inherit block" />
                        Up
                      </CtaButton>
                    </div>
                    <div>
                      <CtaButton preset="blue-outline" class="text-xs" :disabled="index >= contributors.length - 1">
                        Down
                        <Icon name="ph:caret-down-fill" class="!size-4 text-inherit block" />
                      </CtaButton>
                    </div>
                  </div>
                </template>
              </UiWizardResourceList>
            </div>
          </div>
        </div>


        <NuxtPage />
      </div>
    </PageContainer>
  </PageSection>
</template>
