<template>
  <RadioGroup v-model="selectedOption" class="mt-2 flex">
    <RadioGroupOption
      as="template"
      v-for="option in options"
      :key="option.label"
      :value="option.value"
      :disabled="option.disabled"
      v-slot="{ active, checked }"
    >
      <div
        :class="[
            !option.disabled ? 'cursor-pointer focus:outline-none' : 'cursor-not-allowed opacity-25',
            active ? 'ring-2 ring-primary ring-offset-0 hover:ring-offset-2 z-20' : '',
            checked ? 'bg-primary/90 text-white ring-0 hover:bg-primary z-10' : 'bg-gray-50 text-gray-700 ring-0 hover:bg-primary/5 hover:text-gray-900',
            !active && !checked ? 'ring-inset' : '',
            active && checked ? 'ring-2' : '',
            'border transition-all flex items-center justify-center px-5 py-1.5 text-sm font-semibold [&:not(:first-child)]:-ml-[1px] [&:first-child]:rounded-l-md [&:last-child]:rounded-r-md',
            borderColor
          ]">{{ option.label }}</div>
    </RadioGroupOption>
  </RadioGroup>
</template>

<script setup lang="ts">
import { RadioGroup, RadioGroupOption } from '@headlessui/vue'
import type {FieldInputStatus} from "~/components/Ui/Form/FieldStatusIcon.vue";

export type RadioGroupModel = InstanceType<typeof RadioGroup>["$props"]['modelValue']

type MultipleChoiceOption = {
  label: string
  value: RadioGroupModel
  disabled?: boolean
}

const props = defineProps<{
  options: MultipleChoiceOption[],
  status?: FieldInputStatus,
  modelValue: RadioGroupModel
}>()

const borderColor = computed(() => {
  if (props.status === 'success') {
    return 'border-success'
  }
  if (props.status === 'error') {
    return 'border-danger'
  }
  return 'border-gray-200'
})

const emit = defineEmits<{
  'update:modelValue': [value: RadioGroupModel]
}>()

const selectedOption = computed({
  get() {
    return props.modelValue || ''
  },
  set(newValue: RadioGroupModel) {
    emit('update:modelValue', newValue)
  }
})
</script>
