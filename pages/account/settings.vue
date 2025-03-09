<template>
  <div class="section p-8">
    <div class="container mx-auto max-w-xl w-full flex flex-col gap-y-6">
      <UiTitle class="text-primary text-2xl font-semibold mb-2">Account Settings</UiTitle>

      <UiNotification
        type="warning"
        v-if="userData?.user.newUsername"
        :class="{'opacity-50': cancellingUsernameChangeRequest}">
        You have requested to change your email to <b>{{ userData.user.newUsername }}</b>. Please check
        your inbox to verify your new email address or
        <button
          :disabled="cancellingUsernameChangeRequest"
          @click.prevent="cancelChangeUsername"
          class="font-semibold underline"
        >
          click here to cancel
        </button>
      </UiNotification>

      <UiCard>
        <ApiForm
          form-prefix="new_username"
          form-iri="/forms/new-username"
          ref="newUsernameForm"
          submit-text="Update Login Email"
        />
      </UiCard>

      <UiCard>
        <ApiForm form-prefix="change_password" form-iri="/forms/change-password">
          <template #success>
            <div class="prose mb-4">
              <h2 class="text-primary">Your password has been updated</h2>
              <p><strong>Next time you login you will need to use your new password.</strong></p>
            </div>
          </template>
        </ApiForm>
      </UiCard>

      <div class="pt-10 pb-6">
        <UiCard class="prose border-danger">
          <h2 class="text-lg text-danger font-semibold mt-0">Danger zone</h2>
          <p class="text-sm text-gray-500">Papers which have relations to any other PAT users will NOT be deleted. Your author details on papers that remain in PAT will not be deleted. If you wish to delete this data, you can delete your papers manually and remove yourself as an author on papers before you delete your account.</p>
          <button
            class="transition px-3 py-1 text-semibold border w-full rounded-lg border-danger text-danger hover:bg-danger hover:text-white"
            @click="deleteConfirm = true">
            Permanently Delete Account
          </button>
        </UiCard>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <UiModalConfirmDanger
      :open="deleteConfirm"
      :action="deleteAccount"
      title="Are you sure?"
      button-text="Permanently delete my account"
      @close="deleteConfirm = false"
    >
      <div class="prose">
        <p class="font-bold text-danger">The following data will be permanently deleted:</p>
        <ul class="list">
          <li class="list-item">Your user account and default author information</li>
          <li class="list-item">Papers which that you own and do not have authors assigned to other users</li>
          <li class="list-item">Papers you are an author of and no other authors are related to another PAT user</li>
        </ul>
        <p class="font-bold">Important information</p>
        <p>If you are an author on any other papers, your user will be disassociated with the author details but the author details will still exist. If you'd like to delete this information please remove yourself as an author on each paper.</p>
        <p class="font-bold text-danger">This action cannot be reversed.</p>
      </div>
    </UiModalConfirmDanger>
  </Teleport>
</template>

<script setup lang="ts">
import ApiForm from "~/components/Api/ApiForm/ApiForm.vue";

const deleteConfirm = ref(false)
const cancellingUsernameChangeRequest = ref(false)
const newUsernameForm = ref<InstanceType<typeof ApiForm>>()

const { $api } = useNuxtApp()
const { userData, signOut, refresh } = usePatUserSession()

async function cancelChangeUsername () {
  if (!userData.value?.user) {
    return
  }
  cancellingUsernameChangeRequest.value = true
  try {
    await $api(
      userData.value?.user["@id"],
      {
        method: 'PUT',
        body: {
          newUsername: null
        }
      }
    )
    await refresh()
  } catch (error) {
    console.error(error)
  }
  cancellingUsernameChangeRequest.value = false
}

async function deleteAccount() {
  if (!userData.value?.user) {
    return
  }
  try {
    await $api(userData.value?.user["@id"], {
      method: 'DELETE'
    })

    await signOut({ callbackUrl: '/' })
  } catch (error) {
    console.error(error)
    return false
  }
}

const stopWatch = watch(newUsernameForm, (form) => {
  if (!form?.$) {
    return
  }
  watch(() => form.$.exposed?.response.value, async () => {
    await refresh()
  })
  stopWatch()
})
</script>
