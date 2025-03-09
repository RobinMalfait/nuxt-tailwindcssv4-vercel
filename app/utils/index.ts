import {twMerge} from "tailwind-merge";
import dayjs from "dayjs";
import type {SelectOption} from "~/components/Ui/Form/FieldSelect.vue";

export const DEFAULT_INPUT_CLASSES = [
  'transition-all',
  'duration-100',
  'block',
  'w-full',
  'focus:ring-0',
  'rounded-md',
  'bg-white',
  'pl-2.5',
  'pr-2.5',
  'py-1.5',
  'text-base',
  'text-gray-900',
  'border-0',
  'outline',
  'outline-1',
  '-outline-offset-8',
  'placeholder:text-gray-400',
  'focus:outline',
  'focus:outline-[2px]',
  'focus:outline-offset-1',
  'sm:text-sm/6',
  'disabled:opacity-40',
  'outline-transparent',
  'border-gray-300',
  'border',
  'border-1',
  'focus:outline-primary'
]

export const twMergeArrays = (...arrays: string[][]) => {
  return twMerge(...arrays.map(arr => arr.join(' ')))
}

export function formatDate(dateStr: string) {
  return dayjs(dateStr).format('DD/MM/YY @ HH:mm UTCZ')
}

export function arrayToInputOptions(flatOptions: string[]): SelectOption[] {
  return flatOptions.map(s => ({
    label: s,
    value: s
  }))
}
