<template>
  <button v-bind="$attrs" :class="classNames" :type="type || 'button'">
    <span :class="['flex items-center gap-x-1', loading ? 'opacity-0': 'opacity-100']">
      <slot />
    </span>
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0"
      enter-to-class="transform opacity-100"
      leave-active-class="transition ease-in"
      leave-from-class="transform opacity-100"
      leave-to-class="transform opacity-0"
    >
      <span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" v-if="loading">
        <UiSpinner class="size-5" />
      </span>
    </Transition>
  </button>
</template>

<script lang="ts" setup>
import {twMerge} from "tailwind-merge"

const props = defineProps<{
  class?: any
  preset?: keyof typeof presets
  loading?: boolean
  type?: 'button'|'submit'
}>()

const presets = {
  success: 'bg-success text-white enabled:hover:bg-green-600',
  danger: 'bg-danger text-white enabled:hover:bg-red-500',
  'white-outline': 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 enabled:hover:bg-gray-50',
  'blue-outline': 'bg-white text-gray-900/50 ring-1 ring-inset ring-primary/50 enabled:hover:bg-gray-50 enabled:hover:text-primary enabled:hover:ring-primary font-normal'
}

const classNames = computed(() => {
  const baseClassNames = 'relative flex items-center gap-x-1 transition-all disabled:opacity-40 flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm enabled:hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:pointer-none disabled:opacity-50'
  const presetClassNames = props.preset ? twMerge(baseClassNames, presets[props.preset]) : baseClassNames
  return props.class ? twMerge(presetClassNames, props.class) : presetClassNames
})
</script>
