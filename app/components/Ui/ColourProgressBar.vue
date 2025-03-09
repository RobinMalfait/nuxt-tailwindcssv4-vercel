<template>
  <div class="h-2.5 overflow-hidden rounded-full">
    <svg
      viewBox="0 0 1061 10"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      class="m-0 block w-full h-full"
    >
      <defs>
        <clipPath :id="`progress-clip-${randId}`">
          <rect
            :width="percentage + '%'"
            x="0"
            y="0"
            height="100%" />
        </clipPath>
        <linearGradient
          :id="`linearGradient-${randId}`"
          x1="0%"
          y1="100%"
          x2="106.668961%"
          y2="100%">
          <stop
            stop-color="#FF0047"
            offset="0%"/>
          <stop
            stop-color="#FF8E01"
            offset="20.1506546%"/>
          <stop
            stop-color="#E6FF01"
            offset="64.6906672%"/>
          <stop
            stop-color="#00D00F"
            offset="100%"/>
        </linearGradient>
      </defs>
      <g
        stroke="none"
        fill="none"
        fill-rule="evenodd">
        <rect
          id="Rectangle"
          width="100%"
          height="100%"
          ry="50%"
          class="fill-gray-200"
        />
      </g>
      <g
        :clip-path="`url(#progress-clip-${randId})`"
        stroke="none"
        fill="none"
        fill-rule="evenodd">
        <g
          :fill="`url(#linearGradient-${randId})`">
          <rect
            id="Rectangle"
            width="100%"
            height="100%"
            ry="50%"
          />
        </g>
      </g>
    </svg>
  </div>
</template>

<script lang="ts" setup>
const randId = useId()

const props = defineProps<{
  value: number,
  max?: number
}>()

const percentage = computed(() => Math.round((props.value / (props.max || 100)) * 1000) / 10)
</script>
