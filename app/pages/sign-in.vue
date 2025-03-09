<template>
  <AccountFormPage title="Sign in to your account" :request-error="loginError?.data?.err?.statusMessage">
    <form class="gap-y-6" action="/api/auth/login" method="POST" @submit.prevent="login">
      <FieldWrapper label="Email address">
        <template #default="{ fieldId }">
          <FieldInput :attr="{ name: fieldId, id: fieldId, disabled: submitting, type: 'email', autocomplete: 'email', required: true }" v-model="credentials.username" />
        </template>
      </FieldWrapper>

      <FieldWrapper label="Password">
        <template #default="{ fieldId }">
          <FieldInput :attr="{ name: fieldId, id: fieldId, disabled: submitting, type: 'password', autocomplete: 'current-password', required: true }" v-model="credentials.password" />
        </template>
      </FieldWrapper>

      <div class="flex items-center justify-end">
        <div class="text-sm/6">
          <NuxtLink to="/forgot-password" class="font-semibold text-blue-500 hover:text-blue-600">Forgot password?</NuxtLink>
        </div>
      </div>

      <div>
        <CtaButton :disabled="submitting" type="submit">Sign in</CtaButton>
      </div>
    </form>
    <template #footer>
      <p class="mt-10 text-center text-sm/6 text-gray-500">
        Not registered?
        {{ ' ' }}
        <NuxtLink to="/get-started" class="font-semibold text-blue-500 hover:text-blue-600">Sign up</NuxtLink>
      </p>
    </template>
  </AccountFormPage>
</template>

<script lang="ts" setup>
import {FetchError} from "ofetch";
import AccountFormPage from "~/components/AccountFormPage.vue";
import FieldWrapper from "~/components/Ui/Form/FieldWrapper.vue";
import FieldInput from "~/components/Ui/Form/FieldInput.vue";
import CtaButton from "~/components/Ui/CtaButton.vue";

const credentials = reactive({
  username: '',
  password: ''
})
const submitting = ref(false)
const loginError = ref<FetchError<any>>()
const { signIn } = useAuth()
const { fetch: fetchUserSession } = useUserSession()

async function login () {
  loginError.value = undefined
  submitting.value = true
  try {
    await signIn(credentials, { callbackUrl: '/papers' })
    await fetchUserSession()
  } catch(error: any) {
    if (!(error instanceof FetchError)) {
      throw error
    }
    loginError.value = error
  } finally {
    submitting.value = false
  }
}

useHead({
  title: 'Sign in'
})

definePageMeta({
  name: 'sign-in',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/papers'
  }
})
</script>
