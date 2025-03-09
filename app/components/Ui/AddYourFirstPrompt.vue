<template>
  <div class="relative">
    <div class="absolute -top-7 left-9 duration-700" :class="arrowClasses">
      <CurvedArrow :font-controlled="false" class="-translate-x-full text-primary scale-x-[-1.2] origin-top-right h-20 rotate-[10deg]" :class="arrowSvgClass" />
    </div>
    <h2 class="px-32 flex h-20 items-center text-2xl font-bold transition-all duration-1000 ease-in-out" :class="headerClasses">
      Add your first&nbsp;<span class="text-primary">{{ itemName || 'item' }}</span>
    </h2>
  </div>
</template>

<script lang="ts" setup>
import CurvedArrow from '~/assets/icons/curved-arrow.svg'

defineProps<{
  itemName?: string
}>()

const arrowClasses = ref<string[]>(['opacity-0', 'scale-95', 'translate-y-1'])
const headerClasses = ref<string[]>(['opacity-0', 'scale-95', 'translate-x-1'])
const arrowSvgClass = ref<string[]>([])

onMounted(() => {
  setTimeout(() => {
    headerClasses.value = ['opacity-100', 'scale-100', 'translate-x-0']
    arrowClasses.value = ['opacity-100', 'scale-100', 'translate-y-0']
  }, 150)
  setTimeout(() => {
    arrowSvgClass.value = ['animate-pulse']
    headerClasses.value.push('animate-pulse', 'delay-100')
  }, 2500)
})
</script>

