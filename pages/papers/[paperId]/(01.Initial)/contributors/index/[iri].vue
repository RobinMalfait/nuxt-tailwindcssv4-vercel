<script lang="ts" setup>
definePageMeta({
  name: 'contributor-item'
})

const showInitialLoadingScreen = ref(true)

const { isOpen, goToParentPage } = useWizardDrawerPage()
const { iri, isLoading, resource, loadResource } = useIriPage<User>()

const stopWatchInitialLoad = watch(isLoading, (initialLoading) => {
  if (!initialLoading) {
    showInitialLoadingScreen.value = false
    stopWatchInitialLoad()
  }
})
</script>

<template>
  <UiDrawerPage
    @close="goToParentPage"
    :open="isOpen"
    :loading="showInitialLoadingScreen"
    :title="resource ? `${resource.firstName} ${resource.lastName}` : 'Loading...'"
  >
    <template #loading>
      <DevOnly>
        <span class="text-xs text-gray-400 animate-pulse text-center font-normal">[ {{ iri }} ]</span>
      </DevOnly>
    </template>
    <div>
      <AuthorForm
        v-if="resource"
        :resource="resource"
        :is-default-author="false"
        :is-loading="isLoading"
        @reload="loadResource"
      />
    </div>
  </UiDrawerPage>
</template>
