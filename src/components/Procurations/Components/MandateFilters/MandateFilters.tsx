import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { grey } from '~/theme/palette'
import Iconify from '~/mui/iconify'
import { Controller, useForm } from 'react-hook-form'
import { MuiSpacing } from '~/theme/spacing'
import { memo, useCallback, useState } from 'react'
import { ProcurationStatusEnum } from '~/api/Procuration/procuration.model'

interface MandateFiltersProps {
  onFilter: (data: { status: ProcurationStatusEnum[]; search: string }) => void
  onToggleMore: (newValue: boolean) => void
  status: ProcurationStatusEnum[]
  advanced?: boolean
}

function MandateFilters({ onFilter, onToggleMore, status, advanced = false }: Readonly<MandateFiltersProps>) {
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      status,
      search: '',
    },
  })
  const [moreState, setMoreState] = useState(false)

  const onToggleClick = useCallback(() => {
    onToggleMore(!moreState)
    setMoreState(v => !v)
  }, [moreState, onToggleMore])

  const registeredSearch = register('search')
  const onSubmit = handleSubmit(onFilter)

  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={MuiSpacing.normal}>
        <Grid item xs={12} sm={12} md={12} lg={4}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Prénom, nom, commune, bureau de vote"
            size="small"
            label="Rechercher"
            InputProps={{
              startAdornment: <Iconify icon="eva:search-fill" color={grey[500]} sx={{ mr: 1 }} />,
            }}
            {...register('search')}
            onChange={ev => {
              registeredSearch.onChange(ev)
              onSubmit()
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg container spacing={MuiSpacing.normal}>
          {advanced && (
            <Grid item xs={6} lg={6}>
              <FormControl fullWidth>
                <InputLabel id="statuts-label" sx={{ bgcolor: 'white', px: MuiSpacing.smaller }}>
                  Statut
                </InputLabel>
                <Controller
                  name="status"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      fullWidth
                      size="small"
                      labelId="statuts-label"
                      onChange={ev => {
                        onChange(
                          ev.target.value.length ? ev : { target: { value: defaultStatuses.map(({ value }) => value) } }
                        )
                        onSubmit()
                      }}
                      value={value}
                      multiple={true}
                    >
                      {defaultStatuses.map(el => (
                        <MenuItem key={el.label} value={el.value}>
                          {el.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
          )}
          <Grid item xs={6} lg={6}>
            <Button
              variant="outlined"
              onClick={onToggleClick}
              fullWidth
              startIcon={
                <Iconify
                  icon={moreState ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
                  sx={{ mr: 1 }}
                />
              }
            >
              {!moreState ? 'Ouvrir tous les volets' : 'Fermer tous les volets'}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  )
}

const defaultStatuses: { label: string; value: ProcurationStatusEnum }[] = [
  {
    value: ProcurationStatusEnum.COMPLETED,
    label: 'Traité',
  },
  {
    value: ProcurationStatusEnum.EXCLUDED,
    label: 'Exclus',
  },
  {
    value: ProcurationStatusEnum.DUPLICATE,
    label: 'Doublon',
  },
]

export default memo(MandateFilters)
