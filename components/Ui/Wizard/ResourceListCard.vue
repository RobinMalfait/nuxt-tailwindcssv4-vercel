<script setup lang="ts" generic="T extends ApiResource">
import type {NuxtLinkProps} from "#app/components/nuxt-link";

const props = defineProps<{
  resource: T
  hasWarning?: boolean
  linkProps?: NuxtLinkProps
  isButton?: boolean
}>()

const emit = defineEmits<{
  delete: []
}>()

const resourcePropAsRef = toRef(() => (props.resource))

const { resource: storeResource } = useApiResourceForm<T>(resourcePropAsRef, resourcePropAsRef.value['@type'])
</script>

<template>
  <UiCard
    :has-warning="hasWarning"
    :link-props="linkProps"
    :is-button="isButton"
  >
    <slot name="card" :resource="storeResource" />
    <template #footer>
      <div class="relative flex flex-col-reverse sm:flex-row mt-0 sm:gap-x-6 items-center bg-gray-50 py-1 px-1.5 rounded-b-md">
        <div class="flex-grow">
          <slot name="card-footer" :resource="storeResource">
            <span class="text-xs text-gray-400">created: {{ formatDate(resource.created) }}</span>
          </slot>
        </div>
        <div>
          <button type="button" @click="emit('delete')" class="group/delete is-delete relative flex transition-all duration-100 outline -outline-offset-8 outline-2 outline-transparent bg-gray-200/10 p-1 rounded  hover:bg-danger hover:outline-2 hover:outline-offset-2 hover:outline-danger hover:scale-90">
            <Icon name="ph:trash-fill" class="!size-4 opacity-100 group-hover/delete:opacity-0 transition text-gray-500" />
            <Icon name="ph:warning-bold" class="absolute opacity-0 group-hover/delete:opacity-100 !size-5 transition top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
          </button>
        </div>
      </div>
    </template>
  </UiCard>
</template>
