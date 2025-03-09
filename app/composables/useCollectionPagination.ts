import { computed } from 'vue'

export type PaginationProps = {
  currentPage: number
  totalPages: number
  itemsPerPage: number
  totalItems: number
  maxPagesToDisplay?: number
}

export type PaginationEmits = {
  next: []
  previous: []
  change: [value: number]
}

export const useCollectionPagination = (props: PaginationProps) => {
  const pages = computed(() => {
    if (!props.totalPages) {
      return []
    }
    const allPages = Array.from(Array(props.totalPages), (_, x) => x + 1)
    const maxPagesToDisplay = props.maxPagesToDisplay || 7
    if (allPages.length < maxPagesToDisplay) {
      return allPages
    }

    const displayPages = []
    displayPages.push(props.currentPage)
    let lowest = props.currentPage
    let highest = props.currentPage
    let displayCounter = 1
    while (displayCounter < maxPagesToDisplay) {
      displayCounter++
      if ((displayCounter % 2 === 0 || highest >= props.totalPages) && lowest > 1) {
        lowest--
        displayPages.unshift(lowest)
        continue
      }
      if (highest < props.totalPages) {
        highest++
        displayPages.push(highest)
      }
    }
    return displayPages
  })

  const showingFrom = computed(() => (((props.currentPage - 1) * props.itemsPerPage) + 1))
  const showingTo = computed(() => {
    return Math.min((showingFrom.value + props.itemsPerPage - 1), props.totalItems)
  })

  return {
    pages,
    showingFrom,
    showingTo
  }
}
