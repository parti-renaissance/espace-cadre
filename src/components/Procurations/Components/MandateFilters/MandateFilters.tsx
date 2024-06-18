import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { grey } from '~/theme/palette'
import Iconify from '~/mui/iconify'
import { Controller, useForm } from 'react-hook-form'
import { MuiSpacing } from '~/theme/spacing'
import ModalBase from '~/components/ModalBase/ModalBase'
import { memo, useCallback, useState } from 'react'
import { ProcurationStatusEnum } from '~/api/Procuration/procuration.model'
import { fontWeight } from '~/theme/typography'

interface MandateFiltersProps {
  onFilter: (data: Record<string, string>) => void
  onToggleMore: (newValue: boolean) => void
  isProxy?: boolean
  advanced?: boolean
  status?: ProcurationStatusEnum
}

function MandateFilters({
  onFilter,
  onToggleMore,
  status = ProcurationStatusEnum.PENDING,
  isProxy = false,
  advanced = false,
}: Readonly<MandateFiltersProps>) {
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      status,
      search: '',
    },
  })
  const [showModal, setShowModal] = useState(false)
  const [moreState, setMoreState] = useState(false)

  const toggleModal = useCallback(() => setShowModal(v => !v), [])

  const filterThenClose = useCallback(() => {
    handleSubmit(onFilter)()
    setShowModal(false)
  }, [handleSubmit, onFilter])

  const onToggleClick = useCallback(() => {
    onToggleMore(!moreState)
    setMoreState(v => !v)
  }, [moreState, onToggleMore])

  const registeredSearch = register('search')
  const demandStateOptions = isProxy ? proxyDemandStates : demandStates

  return (
    <form onSubmit={handleSubmit(onFilter)}>
      <Grid container spacing={MuiSpacing.normal}>
        <Grid item xs={12} sm={12} md={12} lg={6}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Rechercher par prénom, nom, commune"
            size="small"
            InputProps={{
              startAdornment: <Iconify icon="eva:search-fill" color={grey[500]} sx={{ mr: 1 }} />,
            }}
            {...register('search')}
            onChange={ev => {
              onFilter({ search: ev.target.value })
              registeredSearch.onChange(ev)
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg container spacing={MuiSpacing.normal}>
          {advanced && (
            <Grid item xs={6} lg={4}>
              <Button variant="outlined" onClick={toggleModal} fullWidth>
                Filtres
              </Button>
            </Grid>
          )}
          <Grid item xs={6} lg={8}>
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

      {showModal && (
        <ModalBase pageOnMobile>
          <Grid container spacing={MuiSpacing.normal}>
            <Grid item sx={{ display: { xs: 'block', sm: 'none' } }}>
              <Button startIcon={<Iconify icon="eva:arrow-ios-back-fill" />} onClick={toggleModal}>
                Retour
              </Button>
            </Grid>

            <Grid item xs>
              <Typography fontSize={14} fontWeight={fontWeight.medium}>
                Statut
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="statuts-label" sx={{ bgcolor: 'white', px: MuiSpacing.smaller }}>
                  Statut
                </InputLabel>
                <Controller
                  name="status"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select fullWidth labelId="statuts-label" onChange={onChange} value={value}>
                      <MenuItem value={undefined}>Tous</MenuItem>
                      {demandStateOptions.map(el => (
                        <MenuItem key={el.label} value={el.value}>
                          {el.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} container spacing={MuiSpacing.small} justifyContent="flex-end">
              <Grid item>
                <Button onClick={toggleModal} fullWidth>
                  Annuler
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" onClick={filterThenClose} fullWidth>
                  Filtrer
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </ModalBase>
      )}
    </form>
  )
}

const demandStates: { label: string; value: ProcurationStatusEnum }[] = [
  {
    value: ProcurationStatusEnum.PENDING,
    label: 'En attente',
  },
  {
    value: ProcurationStatusEnum.COMPLETED,
    label: 'Terminé',
  },
  {
    value: ProcurationStatusEnum.DUPLICATE,
    label: 'Doublon',
  },
]

const proxyDemandStates = [
  ...demandStates,
  { value: ProcurationStatusEnum.EXCLUDED, label: 'Exclus' },
  { value: ProcurationStatusEnum.MANUAL, label: 'Manuel' },
]

export default memo(MandateFilters)
