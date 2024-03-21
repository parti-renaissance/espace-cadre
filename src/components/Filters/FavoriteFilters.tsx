import { FilterModel } from '~/models/filter.model'
import Factory from '~/components/Filters/FiltersFactory/Factory'
import { Grid } from '@mui/material'
import { Dispatch, SetStateAction, useMemo } from 'react'
import { MuiSpacing } from '~/theme/spacing'

interface Props {
  apiFilters: FilterModel[]
  onChange: Dispatch<SetStateAction<Record<string, unknown>>>
  resetPage?: () => void
  values: Record<string, unknown>
  debounceInterval?: number
}

const factory = new Factory()

export default function FavoriteFilters({ apiFilters, onChange, values }: Props) {
  const render = useMemo(
    () =>
      apiFilters.map(filter => {
        const element = factory.create(filter.type || 'text', {
          filter,
          value: values[filter.code] ?? '',
          defaultValue: values[filter.code] ?? '',
          onChange: (fieldEventValue: string) => {
            onChange(prevState => ({
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
    [apiFilters, onChange, values]
  )

  return (
    <Grid container spacing={MuiSpacing.normal}>
      {render}
    </Grid>
  )
}
