<script setup lang="ts">
import FieldWrapper from "~/components/Ui/Form/FieldWrapper.vue";

const newAuthor = ref<PartialResource<User>>({
  '@id': '/account/paper_authors/0'
})

const { getFormInputProps, resource, apiState, clearApiState } = useApiResourceForm(newAuthor, 'PaperAuthor')

const newPendingAuthor = ref<PartialResource<ApiResource>>({
  '@id': '/account/pending_authors/0'
})
const initialData = ref<{
  paper: string
  email: string
}>()

const {
  createResource: createPendingAuthor,
  isCreatingResource: isCreatingInvite,
  apiState: pendingApiState,
  clearApiState: clearPendingAuthorApiState
} = useApiResourceForm(newPendingAuthor, 'PendingAuthor', initialData)

defineExpose({
  hideModalAdd: computed(() => (apiState.value.statusCode === 404))
})

const emit = defineEmits<{
  clearAndClose: []
}>()

async function inviteContributor() {
  initialData.value = {
    paper: apiState.value.submitBody.paper,
    email: apiState.value.submitBody.email
  }
  const createSuccess = await createPendingAuthor()
  if(!createSuccess) return false

  clearPendingAuthorApiState()
  emit('clearAndClose')
  return true
}

watch(() => (apiState.value?.submitBody?.email), () => {
  clearPendingAuthorApiState()
})
</script>

<template>
  <div>
    <div class="mb-5">
      <div v-if="apiState.statusCode !== 404" class="flex flex-col gap-y-6 mb-10">
        <UiNotification type="info">
          <p class="text-sm font-bold">All contributors have permissions to edit this paper.</p>
        </UiNotification>
        <ApiResourceFormInput
          :input-props="{
                  attr: { placeholder: 'contributor@paperauthoringtool.com' }
                }"
          v-bind="getFormInputProps('email', {
                  label: 'Contributor Email Address'
                })"
          v-model="resource.email"
        />
      </div>
      <template v-else>
        <div class="flex flex-col gap-y-6">
          <UiNotification type="warning">
            <p class="text-sm"><span class="font-bold">{{ apiState.submitBody.email }}</span> is not a PAT user yet</p>
          </UiNotification>

          <div class="prose">
            <p>You can invite <span class="font-bold">{{ apiState.submitBody.email }}</span> to sign up to PAT. They will be added to this paper automatically with full privileges when they create their account.</p>
            <FieldWrapper
              :show-status="false"
              :errors="pendingApiState.violations ? Object.values(pendingApiState.violations).flat() : []"
            >
              <template #default>
                 <span class="inline-flex">
                  <UiCtaButton @click="inviteContributor" :disabled="isCreatingInvite">
                    Invite Contributor to PAT
                  </UiCtaButton>
                 </span>
              </template>
            </FieldWrapper>
          </div>

          <div class="prose">
            <span class="inline-flex">
              <UiCtaButton @click="clearApiState" class="text-sm" preset="white-outline">
                Try a different email
              </UiCtaButton>
            </span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

