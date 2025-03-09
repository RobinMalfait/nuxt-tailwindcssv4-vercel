<template>
  <fieldset class="[&:not(:last-child)]:mb-4">
    <label v-if="label || infoIdParts || showStatus" :for="fieldId" class="text-sm/6 font-medium text-gray-900 flex gap-x-2 items-center mb-0.5 leading-tight">
      <span v-if="label || !isLabelSlotEmpty">
        <slot name="label">
          {{ label }}
        </slot>
      </span>
      <UiFormFieldInfo v-if="infoIdParts" :id-parts="infoIdParts" />
      <span v-if="showStatus" class="px-1 py-1.5 flex items-center">
        <UiStatus :status="statusState" :status-text="status" />
      </span>
    </label>
    <div class="mt-0">
      <slot name="default" v-bind="{ fieldId }" />
      <div v-if="errors && errors.length" class="text-xs text-danger font-semibold pt-1 px-1">
        <ul class="flex flex-col gap-y-1 my-0">
          <li v-for="(errorMessage, index) of errors" :key="`error-${fieldId}-${index}`">
            {{ errorMessage }}
          </li>
        </ul>
      </div>
      <div v-if="infoMessage" class="mt-1 text-xs px-2 py-1.5 rounded-md bg-primary/10 text-primary">
        {{ infoMessage }}
      </div>
    </div>
  </fieldset>
</template>

<script lang="ts" setup>
import type {FieldInputStatus} from "~/components/Ui/Form/FieldStatusIcon.vue";

const fieldId = useId()

const slots = defineSlots<{
  default(props: { fieldId: typeof fieldId }): void
  label(): void
}>()

const { isSlotEmpty: isLabelSlotEmpty } = useIsSlotEmpty(slots.label)

const statusState = computed(() => {
  if(props.status === 'loading') {
    return 'warning'
  }
  if(props.status === 'invalid') {
    return 'warning-outline'
  }
  if(props.status === 'error') {
    return 'error'
  }
  return 'success'
})

const props = defineProps<{
  label?: string
  errors?: string[]
  infoMessage?: string
  status?: FieldInputStatus
  showStatus?: boolean
  infoIdParts?: string[]
}>()
</script>
