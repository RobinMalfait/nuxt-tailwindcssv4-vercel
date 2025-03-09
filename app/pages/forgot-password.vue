<template>
  <AccountFormPage title="Reset password" :request-error="requestErrorMessage">
    <div v-if="requestSuccess">
      <div class="prose mb-4">
        <h2 class="text-primary">Check your emails</h2>
        <p><strong>We have sent an email for you to reset your password</strong></p>
        <p><strong class="text-gray-600">You will only receive one email every 24 hours. If you do not see the email in your inbox, please check your junk/spam folder.</strong></p>
        <p>If the email does not arrive within 30 minutes, please email <a class="text-primary no-underline hover:text-blue-600" href="mailto:website@paperauthoringtool.com">website@paperauthoringtool.com</a></p>
      </div>
      <NuxtLink to="/sign-in" :disabled="submitting" type="submit" class="disabled:opacity-40 flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"><span aria-hidden="true">←&nbsp;</span> Back to sign in</NuxtLink>
    </div>

    <form v-else class="gap-y-6" action="#" method="POST" @submit.prevent="submitForgotPassword">
      <FieldWrapper label="Email address">
        <template #default="{ fieldId }">
          <FieldInput
            :attr="{
              name: fieldId,
              id: fieldId,
              disabled: submitting,
              type: 'email',
              autocomplete: 'email',
              required: true
            }"
            v-model="emailAddress" />
        </template>
      </FieldWrapper>
      <div>
        <CtaButton :disabled="submitting" type="submit">Request reset email</CtaButton>
      </div>
    </form>
    <template #footer>
      <p v-if="!requestSuccess" class="mt-10 text-center text-sm/6 text-gray-500">
        <NuxtLink to="/sign-in" class="font-semibold text-blue-500 hover:text-blue-600"><span aria-hidden="true">←</span> Back to sign in</NuxtLink>
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

const emailAddress = ref()
const submitting = ref(false)
const requestSuccess = ref(false)
const requestError = ref<FetchError<any>>()
const { $api } = useNuxtApp()

async function submitForgotPassword () {
  requestError.value = undefined
  submitting.value = true
  try {
    await $api(
      '/password/reset/request/' +
      encodeURIComponent(emailAddress.value) +
      '?resetPath=/password/reset/{{ email }}/{{ token }}'
    )
    requestSuccess.value = true
  } catch(error: any) {
    if (!(error instanceof FetchError)) {
      throw error
    }
    requestError.value = error
  } finally {
    submitting.value = false
  }
}

const requestErrorMessage = computed(() => {
  return requestError.value?.statusCode === 404 ? 'Email does not exist' : requestError.value?.message
})

useHead({
  title: 'Reset password'
})

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/papers'
  }
})
</script>
