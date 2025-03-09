<script setup lang="ts">
import {usePaperWizardsStore} from "~/stores/paperWizardsStore";

const { paper } = defineProps<{
  paper: PaperResource
}>()

const route = useRoute()

const paperWizardsStore = usePaperWizardsStore()
paperWizardsStore.setWizardsByPaperStudyType(paper.studyType)

const isWizardsShowing = ref(false)

function showWizards () {
  isWizardsShowing.value = true
}

function hideWizards () {
  isWizardsShowing.value = false
}

function toggleWizards () {
  if (!isWizardsShowing.value) {
    showWizards()
  } else {
    hideWizards()
  }
}

watch(() => route.path, () => {
  hideWizards()
})
</script>

<template>
  <div class="self-stretch h-full">
    <button
      class="transition z-20 relative h-full inline-flex items-center rounded-t-md px-4 font-bold gap-x-2 cursor-pointer"
      :class="[isWizardsShowing ? 'bg-gray-50' : 'text-gray-700 bg-white hover:bg-gray-50', { 'text-primary': !paperWizardsStore.currentWizard?.name || isWizardsShowing }]"
      @click="toggleWizards"
    >
      <span v-if="paperWizardsStore.currentWizard" class="py-0.5 flex items-center">
        <UiStatus :status="paperWizardsStore.currentWizard.isComplete.value === undefined ? 'unset' : (paperWizardsStore.currentWizard.isComplete.value ? 'success' : 'warning-outline')" size="size-3" />
      </span>
      {{ paperWizardsStore.currentWizard?.name || 'Select wizard' }}
      <Icon name="heroicons-solid:chevron-down" class="!size-6 transition duration-300" :class="[isWizardsShowing ? 'rotate-180' : '']" />
    </button>
    <FadeScaleTransition>
      <div v-if="isWizardsShowing" class="absolute z-20 bg-gray-50 w-full left-0 text-gray-600">
        <PageSection>
          <PageContainer>
            <div class="flex gap-x-4 text-sm">
              <div class="w-1/4 flex flex-col gap-y-4" v-for="(wizardColumn, wizardColumnIndex) of paperWizardsStore.wizards" :key="`wizard-column-${wizardColumnIndex}`">
                <div
                  v-for="(wizardGroup, wizardGroupIndex) of wizardColumn"
                  :key="`wizard-group-${wizardColumnIndex}-${wizardGroup.groupName || wizardGroupIndex}`"
                  class=""
                >
                  <span v-if="wizardGroup.groupName" class="block font-bold mb-1 text-gray-400/90">{{ wizardGroup.groupName }}</span>
                  <ul class="w-full flex flex-col gap-y-0.5 font-bold">
                    <li v-for="(wizard) of wizardGroup.wizards" :key="`wizardlink-${wizardColumnIndex}-${wizard.routeName}`" class="flex gap-x-0.5">
                      <div class="pr-1 py-0.5 flex items-center">
                        <UiStatus :status="wizard.isComplete.value === undefined ? 'unset' : (wizard.isComplete.value ? 'success' : 'warning-outline')" size="size-1.5" />
                      </div>
                      <NuxtLink :to="{ name: wizard.routeName, params: route.params }" class="text-gray-900/60 hover:text-gray-900 focus:text-primary transition" active-class="text-primary" no-prefetch>{{ wizard.name }}</NuxtLink>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </PageContainer>
        </PageSection>
      </div>
    </FadeScaleTransition>
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="transform opacity-0"
        enter-to-class="transform opacity-100"
        leave-active-class="transition ease-in"
        leave-from-class="transform opacity-100"
        leave-to-class="transform opacity-0"
      >
        <div @click="hideWizards" v-if="isWizardsShowing" class="fixed z-10 inset-0 bg-black/50"></div>
      </Transition>
    </Teleport>
  </div>
</template>
