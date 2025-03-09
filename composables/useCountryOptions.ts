import { iso31661 } from 'iso-3166'
import type {SelectOption} from "~/components/Ui/Form/FieldSelect.vue";

export function useCountryOptions () {
  const primaryCountries = ['GB', 'US']

  const countryOptions: SelectOption[] = iso31661
    .sort((a) => {
      return primaryCountries.includes(a.alpha2) ? -1 : 0
    })
    .map(({ name, alpha2 }) => {
      const displayName = alpha2 === 'GB' ? 'United Kingdom' : name
      return {
        value: displayName,
        label: displayName
      }
    })

  return {
    countryOptions
  }
}
