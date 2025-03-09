<template>
  <AccountFormPage title="Sign up to PAT" is-wide>
    <template #default>
      <ApiApiForm
        v-show="!formSuccess"
        ref="apiForm"
        form-prefix="user"
        form-iri="/forms/register"
        submit-path="/api/auth/register"
        submit-text="Sign in"
      />
      <div v-if="formSuccess">
        <div class="prose mb-4">
          <h2 class="text-primary">Registered successfully</h2>
          <p><strong>We are now logging you in...</strong></p>
          <p>If nothing happens please click here to <NuxtLink to="/sign-in">sign in</NuxtLink></p>
        </div>
      </div>
    </template>
    <template #footer>
      <p class="mt-10 text-center text-sm/6 text-gray-500">
        Already registered?
        {{ ' ' }}
        <NuxtLink to="/sign-in" class="font-semibold text-blue-500 hover:text-blue-600">Sign in</NuxtLink>
      </p>
    </template>
  </AccountFormPage>
</template>

<script lang="ts" setup>
import AccountFormPage from "~/components/AccountFormPage.vue";

const { signIn } = useAuth()
const apiForm = ref()

const formSuccess = computed(() => {
  if (!apiForm.value) {
    return false
  }
  return apiForm.value.success
})

const submitting = computed(() => {
  if (!apiForm.value) {
    return false
  }
  return apiForm.value.submitting
})

const submitBody = computed({
  get() {
    if (!apiForm.value) {
      return false
    }
    return apiForm.value.submitBody
  },
  set(newValue) {
    if (!apiForm.value) {
      return false
    }
    apiForm.value.submitBody = newValue
  }
})

watch(() => submitBody.value?.user?.username, (newUsername, oldUsername) => {
  if (!submitBody.value.user.email || submitBody.value.user.email === oldUsername) {
    submitBody.value.user.email = newUsername
  }
})

watch(formSuccess, async (isSuccess) => {
  if (!apiForm.value) {
    return
  }
  if (isSuccess) {
    const user = apiForm.value?.submitBody?.user
    if (user) {
      await signIn({
        username: user.email,
        password: user.plainPassword.first
      }, { callbackUrl: '/account/author' })
    }
  }
})

useHead({
  title: 'Sign Up'
})

definePageMeta({
  name: 'get-started',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/papers'
  }
})
</script>
