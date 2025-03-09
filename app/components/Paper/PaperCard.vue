<template>
  <UiCard :link-props="{ to: { name: 'paper-default-wizard', params: { paperId: paper.id } }}">
    <div class="flex items-center">
      <div class="flex-grow min-w-0">
        <h2 class="font-semibold text-lg md:text-xl">
          {{ paper.title }}
        </h2>
        <h3 class="text-primary">
          {{ authorName }}
        </h3>

        <div v-if="progress" class="mt-2">
          <span class="text-xs text-gray-500">
            <span class="font-semibold">{{ progress.percent }}% Complete</span> <span class="text-gray-400">({{ progress.valid }}/{{ progress.required }})</span>
          </span>
          <UiColourProgressBar :value="progress.percent" />
        </div>
      </div>
      <div class="pl-4">
        <Icon name="heroicons-solid:arrow-right" class="!size-6 text-primary" />
      </div>
    </div>
  </UiCard>
</template>

<script lang="ts" setup>
const props = defineProps<{
  paper: ApiResource
}>()

const authorName = computed(() => {
  const firstAuthor = props.paper.paperAuthors?.[0]
  if (!firstAuthor) {
    return '--'
  }
  return `${firstAuthor.firstName} ${firstAuthor.lastName}`
})

const progress = computed(() => props.paper?._metadata?.progress)


</script>
