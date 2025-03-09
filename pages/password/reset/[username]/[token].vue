<template>
  <AccountFormPage :title="`Reset password`" :request-error="requestErrorMessage">
    <form class="gap-y-6" action="#" method="POST" @submit.prevent="submitReset">
      <FieldWrapper label="Email address">
        <template #default="{ fieldId }">
          <FieldInput
            :attr="{
              name: fieldId,
              id: fieldId,
              disabled: true,
              type: 'email',
              autocomplete: 'username',
              required: true
            }"
            v-model="username"
          />
        </template>
      </FieldWrapper>
      <FieldWrapper label="New Password">
        <template #default="{ fieldId }">
          <FieldInput
            :attr="{
              name: fieldId,
              id: fieldId,
              disabled: submitting,
              type: 'password',
              autocomplete: 'new-password',
              required: true
            }"
            v-model="password.first" />
        </template>
      </FieldWrapper>
      <FieldWrapper label="Repeat Password">
        <template #default="{ fieldId }">
          <FieldInput
            :attr="{
              name: fieldId,
              id: fieldId,
              disabled: submitting,
              type: 'password',
              autocomplete: 'new-password',
              required: true
            }"
            v-model="password.repeat"
          />
        </template>
      </FieldWrapper>
      <div>
        <CtaButton :disabled="submitting" type="submit">Reset</CtaButton>
      </div>
    </form>
  </AccountFormPage>
</template>

<script lang="ts" setup>
import AccountFormPage from "~/components/AccountFormPage.vue";
import {FetchError} from "ofetch";
import FieldWrapper from "~/components/Ui/Form/FieldWrapper.vue";
import FieldInput from "~/components/Ui/Form/FieldInput.vue";
import CtaButton from "~/components/Ui/CtaButton.vue";
import {getRouteParamAsString} from "~/utils/getRouteParamAsString";

const submitting = ref(false)
const password = reactive({
  first: '',
  repeat: ''
})
const requestErrorMessage = ref()
const $route = useRoute()
const { $api } = useNuxtApp()
const { signIn } = useAuth()

const username = ref<string>(getRouteParamAsString($route.params.username))
const token = ref<string>(getRouteParamAsString($route.params.token))

async function submitReset() {
  requestErrorMessage.value = undefined
  if (password.first === '') {
    requestErrorMessage.value = 'Please enter your new password'
    return
  }
  if (password.first !== password.repeat) {
    requestErrorMessage.value = 'Your passwords do not match'
    return
  }
  const body = {
    username: username.value,
    token: token.value,
    password: password.first
  }

  submitting.value = true
  try {
    await $api('/password/reset', {
      method: 'POST',
      body
    })
    await signIn({
      username: username.value,
      password: password.first
    }, { callbackUrl: '/papers' })
  } catch(error: any) {
    if (!(error instanceof FetchError)) {
      throw error
    }
    if (error.statusCode === 404) {
      requestErrorMessage.value = 'We could not match your username and password reset token. Please make sure you are using the latest reset email and have not already changed your password'
    } else if(error.statusCode === 400) {
      requestErrorMessage.value = error.data
    } else {
      console.error(error)
      requestErrorMessage.value = 'Unknown error occurred'
    }
  } finally {
    submitting.value = false
  }
}

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/papers'
  }
})
</script>
