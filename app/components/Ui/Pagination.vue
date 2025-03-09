<template>
  <div class="flex items-center justify-between py-3">
    <div class="flex flex-1 justify-between sm:hidden">
      <button class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" @click="emit('previous')">Previous</button>
      <button class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" @click="emit('next')">Next</button>
    </div>
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          Showing
          {{ ' ' }}
          <span class="font-medium">{{ showingFrom }}</span>
          {{ ' ' }}
          to
          {{ ' ' }}
          <span class="font-medium">{{ showingTo }}</span>
          {{ ' ' }}
          of
          {{ ' ' }}
          <span class="font-medium">{{ totalItems }}</span>
          {{ ' ' }}
          results
        </p>
      </div>
      <div>
        <nav class="isolate inline-flex -gap-x-px rounded-md shadow-sm" aria-label="Pagination">
          <button @click="emit('previous')" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
            <span class="sr-only">Previous</span>
            <Icon name="heroicons-chevron-left" class="!size-5" aria-hidden="true" />
          </button>

          <button
            @click="emit('change', page)"
            v-for="page of pages"
            :key="`collection-page-${page}`"
            :class="[baseClass, page === currentPage ? currentClass : defaultClass]"
          >
            {{ page }}
          </button>

          <button @click="emit('next')" class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
            <span class="sr-only">Next</span>
            <Icon name="heroicons-chevron-right" class="!size-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {PaginationEmits, PaginationProps} from "~/composables/useCollectionPagination"

const props = defineProps<PaginationProps>()
const emit = defineEmits<PaginationEmits>()

const baseClass = 'relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20'
const currentClass = 'z-10 bg-primary text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
const defaultClass = 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'

const { pages, showingFrom, showingTo } = useCollectionPagination(props)
</script>
