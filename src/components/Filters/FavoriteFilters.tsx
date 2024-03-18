import { FilterModel } from '~/models/filter.model'
import Factory from '~/components/Filters/FiltersFactory/Factory'
import { Grid } from '@mui/material'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { useDebounce } from 'react-use'

interface Props {
  apiFilters: FilterModel[]
  onChange: Dispatch<SetStateAction<Record<string, unknown>>>
  resetPage?: () => void
  values: Record<string, unknown>
  debounceInterval?: number
}

const factory = new Factory()

export default function FavoriteFilters({ apiFilters, onChange, values, debounceInterval = 400, resetPage }: Props) {
  const [localValues, setLocalValues] = useState(values)

  useDebounce(
    () => {
      onChange(localValues)
      resetPage?.()
    },
    debounceInterval,
    [localValues]
  )

  const render = useMemo(
    () =>
      apiFilters.map(filter => {
        const element = factory.create(filter.type || 'text', {
          filter,
          value: localValues[filter.code] ?? '',
          defaultValue: values[filter.code] ?? '',
          onChange: (fieldEventValue: string) => {
            setLocalValues(prevState => ({
              ...prevState,
              [filter.code]: fieldEventValue,
            }))
          },
        })

        return (
          <Grid item key={filter.code} xs={12} sm={6} md={3}>
            {element}
          </Grid>
        )
      }),
    [apiFilters, values, localValues]
  )

  return (
    <Grid container spacing={2}>
      {render}
    </Grid>
  )
}
