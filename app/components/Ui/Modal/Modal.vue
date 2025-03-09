<template>
  <TransitionRoot as="template" :show="open">
    <Dialog class="relative z-50" @close="dialogClose">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500/75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-2">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
              <div class="flex flex-col gap-y-2 sm:flex-row sm:gap-y-0 sm:gap-x-4 sm:items-start">
                <div v-if="!isIconSlotEmpty" class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                  <slot name="icon" />
                </div>
                <div class="flex-grow text-left">
                  <DialogTitle v-if="title" as="h3" class="text-lg font-semibold" :class="titleClasses">{{ title }}</DialogTitle>
                  <div :class="{ 'mt-2': !!title }">
                    <slot name="default" />
                  </div>
                </div>
              </div>
              <ActionButtons v-if="actionProps" v-bind="actionProps" @close="emit('close')" class="mt-5 sm:mt-4">
                <template #extraAction>
                  <slot name="extraAction" />
                </template>
              </ActionButtons>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import {Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot} from '@headlessui/vue'
import ActionButtons from "~/components/Ui/Form/ActionButtons.vue";

const emit = defineEmits<{
  close: []
}>()

const slots = defineSlots<{
  default(): void,
  icon(): void,
  extraAction(): void
}>()

const { isSlotEmpty: isIconSlotEmpty } = useIsSlotEmpty(slots.icon)

const props = defineProps<{
  title?: string
  open: boolean
  actionProps?: ComponentProps<typeof ActionButtons>
  quickClose?: boolean
}>()

const titleClasses = computed(() => {
  if (props.actionProps?.buttonProps?.preset === 'danger') {
    return 'text-danger'
  }
  return 'text-primary'
})

function dialogClose() {
  if (props.quickClose) emit('close')
}
</script>
