import { FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { grey } from '~/theme/palette'
import Iconify from '~/mui/iconify'
import { MuiSpacing } from '~/theme/spacing'
import { memo } from 'react'
import { ProcurationStatusEnum } from '~/api/Procuration/procuration.model'
import ZoneAutocomplete from '~/components/Filters/Element/ZoneAutocomplete'
import { fontWeight } from '~/theme/typography'
import { AddressZoneModel } from '~/models/activist.model'

export interface IFilters {
  status: ProcurationStatusEnum[]
  search?: string
  zone?: AddressZoneModel
}

interface MandateFiltersProps {
  onFilter: (data) => void
  filter: IFilters
  advanced?: boolean
}

function MandateFilters({ onFilter, filter, advanced = false }: Readonly<MandateFiltersProps>) {
  return (
    <Grid container spacing={MuiSpacing.normal}>
      <Grid item xs={12}>
        <p>
          <Typography fontWeight={fontWeight.medium} color={'text.secondary'}>
            Filtres
          </Typography>
        </p>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Prénom, nom, commune, bureau de vote"
          size="small"
          label="Rechercher"
          InputProps={{
            startAdornment: <Iconify icon="eva:search-fill" color={grey[500]} sx={{ mr: 1 }} />,
          }}
          onChange={ev => onFilter({ search: ev.target.value })}
        />
      </Grid>
      <Grid item xs={12}>
        <ZoneAutocomplete
          placeholder="Zone géographique"
          value={filter.zone}
          onChange={zone => onFilter({ zone })}
          size="small"
        />
      </Grid>
      {advanced && (
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="statuts-label" sx={{ bgcolor: 'white', px: MuiSpacing.smaller }}>
              Statut
            </InputLabel>
            <Select
              size="small"
              labelId="statuts-label"
              onChange={ev =>
                onFilter({
                  status: ev.target.value.length ? ev.target.value : defaultStatuses.map(({ value }) => value),
                })
              }
              value={filter.status}
              multiple={true}
            >
              {defaultStatuses.map(el => (
                <MenuItem key={el.label} value={el.value}>
                  {el.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      )}
    </Grid>
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
