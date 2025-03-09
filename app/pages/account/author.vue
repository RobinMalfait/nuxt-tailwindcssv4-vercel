<template>
  <PageSection>
    <PageContainer size="medium" class="flex flex-col space-y-6">
      <UiTitle>Your Author Details</UiTitle>

      <UiNotification type="info">
        The information entered on this page will be copied to papers when you
        create them or you are added as an author.
      </UiNotification>

      <AuthorForm
        v-if="userData?.user"
        :resource="userData.user"
        :is-default-author="true"
        :is-loading="isLoading"
        @reload="reloadAuthor"
      />
    </PageContainer>
  </PageSection>
</template>

<script setup lang="ts">
const { userData, refresh, status } = usePatUserSession()

async function reloadAuthor () {
  await refresh()
}

onMounted(() => {
  reloadAuthor()
})

const isLoading = computed(() => status.value === 'loading')
</script>
