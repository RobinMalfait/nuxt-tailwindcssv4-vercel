<template>
  <span class="relative flex items-center" :class="[isInfoShowing ? 'z-50' : 'z-10']">
    <button @mousedown.stop @click="toggleInfo" class="relative flex z-50 cursor-pointer" ref="reference" tabindex="-1" type="button">
      <span class="transition-opacity absolute block size-5 text-primary z-10" :class="[tooltipStatus === 'loading' ? 'opacity-100' : 'opacity-0']"><UiSpinner /></span>
      <Icon :name="isInfoShowing ? 'flowbite:info-circle-solid' : 'flowbite:info-circle-outline'" class="transition !size-5 rounded-full" :class="[isInfoShowing ? 'text-primary' : 'text-gray-500', tooltipStatus === 'loading' ? 'opacity-50' : 'opacity-100']" />
    </button>
    <FadeScaleTransition>
      <span
        class="absolute block z-20"
        v-show="isInfoShowing && tooltipStatus !== 'loading'"
      >
        <span
          @mousedown.stop
          ref="floating"
          :style="floatingStyles"
          :class="[middlewareData.hide?.referenceHidden ? 'opacity-0': 'opacity-100']"
          class="z-50 transition-opacity w-max max-w-xs min-w-[240px] top-0 left-0 bg-gray-50 rounded-md p-2 border border-gray-300 text-sm outline outline-2 outline-offset-1 outline-primary"
        >
          <span>
            <span v-if="isAdmin">
              <ApiResourceFormTextarea
                v-if="tooltipResource && storeResource"
                :input-props="{
                  attr: { placeholder: 'More information coming soon' }
                }"
                v-bind="getBaseFormInputProps(tooltipResource['@id'], 'tooltip', {
                  wrapper: { label: '' }
                })"
                v-model="storeResource.tooltip"
              />
            </span>
            <span class="text-sm text-gray-400" v-else>{{ tooltipContent }}</span>
            <span class="flex text-primary text-xs font-semibold mt-1.5">#{{ displayId }}</span>
          </span>
          <span
            ref="floatingArrow"
            :style="{
              position: 'absolute',
              left:
               middlewareData && middlewareData.arrow?.x != null
                  ? `${middlewareData.arrow.x}px`
                  : '',
              top:
                middlewareData && middlewareData.arrow?.y != null
                  ? `${middlewareData.arrow.y}px`
                  : '',
            }"
            class="absolute [left:-0.5rem] h-6 w-6 bg-white border-2 border-primary backface-hidden"
            :class="[
              placement.startsWith('bottom') ?
                'bottom-full mb-0.5 border-b-0 rounded-t-md' :
                'top-full mt-0.5 border-t-0 rounded-b-md'
              ]"
          >
          </span>
        </span>
      </span>
    </FadeScaleTransition>
  </span>
</template>

<script lang="ts" setup>
import {arrow, autoUpdate, flip, hide, offset, useFloating, shift} from "@floating-ui/vue";
import {usePatUserSession} from "~/composables/usePatUserSession";
import FadeScaleTransition from "~/components/FadeScaleTransition.vue";
import {getBaseFormInputProps} from "~/composables/useApiResourceForm";

type TooltipResourceType = ApiResource & {}
type TooltipResultsType = { 'hydra:totalItems': number, 'hydra:member': TooltipResourceType[] }

const isInfoShowing = ref(false)
const reference = ref(null)
const floating = ref(null)
const floatingArrow = ref(null)

const referenceForUseFloating = ref<typeof reference['value']>(null)

const tooltipResource = ref<TooltipResourceType>()
const tooltipStatus = ref<'idle'|'loading'|'success'>('idle')

const props = defineProps<{
  idParts: string[]
}>()

const { $api } = useNuxtApp()
const { isAdmin } = usePatUserSession()

const { middlewareData, floatingStyles, placement } = useFloating(referenceForUseFloating, floating, {
  placement: 'bottom-start',
  middleware: [
    offset(2),
    flip({
      // fallbackAxisSideDirection: 'start',
      crossAxis: false
    }),
    shift({
      padding: 5
    }),
    arrow({
      element: floatingArrow,
      padding: 10
    }),
    hide()
  ],
  whileElementsMounted: autoUpdate,
})

onMounted(async () => {
  // initialising while a modal view is showing will make the modal jump appear and not animate
  await nextTick(() => {
    referenceForUseFloating.value = reference.value
  })
})

const displayId = computed(() => props.idParts.join('_'))
const tooltipContent = computed(() => {
  if (!tooltipResource.value) {
    return tooltipStatus.value === 'success' ? 'No resource' : 'Loading'
  }
  return tooltipResource.value.tooltip || 'More information coming soon'
})

function toggleInfo() {
  isInfoShowing.value = !isInfoShowing.value
  if (isInfoShowing.value) {
    document.body.dispatchEvent(new CustomEvent('mousedown'))
  }
}

function bodyClickListener () {
  isInfoShowing.value = false
}

function removeBodyClickListener () {
  document.body.removeEventListener('mousedown', bodyClickListener)
}

async function createNewTooltip () {
  if (!isAdmin.value) {
    return
  }
  try {
    tooltipResource.value = await $api<TooltipResourceType>(`/field_tooltips`, {
      method: 'POST',
      body: {
        fieldId: displayId.value
      }
    })
    tooltipStatus.value = 'success'
  } catch(err: any) {
    console.error('Error creating tooltip:', err)
    isInfoShowing.value = false
  } finally {
    tooltipStatus.value = 'idle'
  }
}

async function loadTooltip () {
  if (tooltipStatus.value !== 'idle' || tooltipResource.value) {
    return
  }
  tooltipStatus.value = 'loading'
  try {
    const newTooltipResult = await $api<TooltipResultsType>(`/field_tooltips?fieldId=${displayId.value}`)
    if (newTooltipResult && newTooltipResult?.['hydra:totalItems'] > 0) {
      tooltipResource.value = newTooltipResult['hydra:member'][0]
      tooltipStatus.value = 'success'
      return
    }
  } catch(error: any) {
    tooltipStatus.value = 'idle'
    isInfoShowing.value = false
    console.error(error)
    return
  }

  await createNewTooltip()
}

watch(tooltipResource, (resource) => {
  resource && initResourceForm()
})

const { resource: storeResource, getFormInputProps, init: initResourceForm } = useApiResourceForm<TooltipResourceType>(tooltipResource)

watch(isInfoShowing, async () => {
  removeBodyClickListener()
  if (isInfoShowing.value) {
    setTimeout(() => {
      document.body.addEventListener('mousedown', bodyClickListener, {
        once: true
      })
    }, 10)

    await loadTooltip()
  }
})

onBeforeUnmount(() => {
  removeBodyClickListener()
})
</script>
