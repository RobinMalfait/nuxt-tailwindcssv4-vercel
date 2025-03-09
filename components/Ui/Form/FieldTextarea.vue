<template>
  <div class="relative">
    <textarea v-bind="attr" v-model="model" :class="inputClassNames" @blur="emit('blur')"></textarea>
    <span
      v-if="characterLimit"
      class="transition absolute bottom-[1px] right-[2px] rounded-md py-0.5 px-1.5 text-xs tbg-white/80 backdrop-blur-sm"
      :class="[textColorClass, attr?.disabled ? 'opacity-50' : 'opacity-100']"
    >{{ charactersRemain }} characters remaining</span>
    <FieldStatusIcon :status="hideIcon ? undefined : status" role="status" class="top-5" />
  </div>
</template>

<script lang="ts" setup>
import type {ReservedProps} from "vue"
import type {TextareaHTMLAttributes} from "@vue/runtime-dom"
import FieldStatusIcon from "~/components/Ui/Form/FieldStatusIcon.vue";
import {type BaseProps, uiFormField} from "~/composables/useUiFormField";
import {twMerge} from "tailwind-merge";

type ModelType = string|null|undefined

export type FieldTextareaProps = BaseProps<ModelType> & {
  attr?: TextareaHTMLAttributes & ReservedProps & Record<string, unknown>
  characterLimit?: number
}

const props = withDefaults(defineProps<FieldTextareaProps>(), {
  characterLimit: 2500
})
const emit = defineEmits<{
  blur: [],
  'update:modelValue': [value: ModelType]
}>()

defineOptions({
  inheritAttrs: false
})

const { model, inputClassNames: baseInputClassNames, displayStatus } = uiFormField<typeof props, ModelType>(props, emit)

const inputClassNames = computed(() => {
  return twMerge(baseInputClassNames.value, displayStatus.value ? 'pr-11' : 'pr-3', props.characterLimit ? 'pb-4' : '')
})

const charactersRemain = computed(() => (props.characterLimit ? (props.characterLimit - (model.value?.length || 0)) : undefined))

const textColorClass = computed(() => {
  if (charactersRemain.value === undefined || charactersRemain.value > 25) {
    return 'text-gray-400'
  }
  return ['font-semibold', charactersRemain.value <= 0 ? 'text-danger' : 'text-warning']
})

watch(model, () => {
  if (!model.value || !props.characterLimit) {
    return
  }
  if (model.value.length > props.characterLimit) {
    model.value = model.value.substring(0, props.characterLimit)
  }
})
</script>
