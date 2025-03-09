<template>
  <div>
    <select
      v-model="selectedTabIndex"
      aria-label="Select a tab"
      :class="twMergeArrays(DEFAULT_INPUT_CLASSES, ['sm:hidden', 'pr-8', 'bg-gray-50', 'text-primary', 'border-b-primary', 'border-b-4', 'py-2', 'text-lg', 'outline-2', 'outline-offset-1'])"
    >
      <option v-for="(tab, tabIdx) in tabs" :key="`select-options-${tab.label}`" :selected="isTabSelected(tab)" :value="tabIdx">{{ tab.label }}</option>
    </select>
    <div class="hidden sm:block">
      <nav class="isolate flex divide-x divide-gray-200 rounded-lg shadow" aria-label="Tabs">
        <button @click="selectTab(tabIdx)" v-for="(tab, tabIdx) in tabs" :key="`tab-${tab.label}`" :class="[isTabSelected(tab) ? 'text-primary' : 'text-gray-500 hover:text-gray-900', tabIdx === 0 ? 'rounded-l-lg' : '', tabIdx === tabs.length - 1 ? 'rounded-r-lg' : '', 'transition-all group relative min-w-0 flex-1 overflow-hidden bg-gray-50 px-4 py-3 text-center text-base font-bold hover:bg-primary/5 focus:z-10']">
          <span>{{ tab.label }}</span>
          <span aria-hidden="true" :class="[isTabSelected(tab) ? 'bg-primary h-0.5' : 'bg-transparent h-0', 'transition-all absolute inset-x-0 bottom-0']" />
        </button>
      </nav>
    </div>
    <div class="mt-4">
      <slot name="item" v-if="tabs?.[selectedTabIndex]" :index="selectedTabIndex" :item="tabs[selectedTabIndex]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {DEFAULT_INPUT_CLASSES, twMergeArrays} from "~/utils";

type Tab = {
  label: string
}

defineSlots<{
  item(props: { index: number, item: Tab }): any
}>()

const props = defineProps<{
  tabs: Tab[]
}>()

const selectedTabIndex = ref(0)
function selectTab (newTabIndex: number) {
  selectedTabIndex.value = newTabIndex
}

function isTabSelected(tab: Tab) {
  return props.tabs && tab.label === props.tabs[selectedTabIndex.value].label
}

defineExpose({
  selectedTabIndex
})
</script>
