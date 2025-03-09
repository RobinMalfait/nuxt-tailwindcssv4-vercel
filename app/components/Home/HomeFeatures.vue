<template>
  <div class="py-24">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl lg:max-w-none">
        <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-8 lg:max-w-none lg:grid-cols-3">
          <div v-for="feature in features" :key="feature.title" class="flex flex-col border rounded-md shadow p-6">
            <dt class="text-base font-semibold text-primary relative mb-2">
              <div class="mb-6 flex items-center justify-start">
                <img class="h-24" :src="feature.image" :alt="`Icon for ${feature.title}`" />
              </div>
              {{ feature.title }}
              <span class="absolute -bottom-1.5 left-0 border-b-4 border-aqua w-20"></span>
            </dt>
            <dd class="mt-1 flex flex-auto flex-col text-base/7 text-gray-600">
              <p class="flex-auto">{{ feature.description }}</p>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type FeatureType = {
  title: string
  description: string
  image: string
}

const features: FeatureType[] = [
  {
    title: 'Create papers with Wizards',
    description:
      'There are wizards to create each part of the paper. They are linked so that information in one part of the paper informs prompts in related parts.',
    image: '/home/1-create-papers.svg'
  },
  {
    title: 'RCTs and pilot and feasibility studies',
    description:
      'The current version supports reporting of randomised controlled trials and pilot and feasibility studies.',
    image: '/home/2-rcts.svg'
  },
  {
    title: 'Integration with domain-specific ontologies',
    description:
      'Allows users to enter labels from the Ontology Lookup Service.',
    image: '/home/3-integration.svg'
  },
  {
    title: 'Export machine readable versions of papers',
    description:
      'Makes all the key information in papers available in machine-readable form to allow automated search and evidence synthesis tools to use the data minimising the need for expensive and time-consuming human coders.',
    image: '/home/4-machine-readable.svg'
  },
  {
    title: 'Export drafts of papers as word files',
    description:
      'The export can be previewed and exported for further editing before submission to a journal.',
    image: '/home/5-word.svg'
  },
  {
    title: 'Author profile for consistency',
    description:
      'Create a re-usable author profile, including declarations of competing interest, linked to ORCID, that can be re-used in multiple papers.',
    image: '/home/6-author-profile.svg'
  }
]
</script>
