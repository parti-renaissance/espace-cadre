import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { grey } from '~/theme/palette'
import Iconify from '~/mui/iconify'
import { useForm } from 'react-hook-form'
import { MuiSpacing } from '~/theme/spacing'
import ModalBase from '~/components/ModalBase/ModalBase'
import { memo, useCallback, useState } from 'react'
import { ProcurationStatusEnum } from '~/api/Procuration/procuration.model'

interface MandateFiltersProps {
  onFilter: (data: Record<string, string>) => void
  onToggleMore: (newValue: boolean) => void
  isProxy?: boolean
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
]

function MandateFilters({ onFilter, onToggleMore, isProxy = false }: Readonly<MandateFiltersProps>) {
  const { register, handleSubmit } = useForm()
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
  const demandStateOptions = isProxy
    ? [...demandStates, { value: ProcurationStatusEnum.EXCLUDED, label: 'Exclus' }]
    : demandStates

  return (
    <form onSubmit={handleSubmit(onFilter)}>
      <Grid container spacing={MuiSpacing.normal}>
        <Grid item xs={12} sm={12} md={4} lg={6}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Rechercher..."
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
        <Grid item xs={12} sm={12} md={8} lg={6} container spacing={MuiSpacing.normal}>
          <Grid item xs={4}>
            <Button variant="outlined" onClick={toggleModal} fullWidth>
              Filtres
            </Button>
          </Grid>
          <Grid item xs={8}>
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

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="statuts-label">Statuts</InputLabel>
                <Select fullWidth labelId="statuts-label" {...register('status')}>
                  <MenuItem value={undefined}>Tous</MenuItem>
                  {demandStateOptions.map(el => (
                    <MenuItem key={el.label} value={el.value}>
                      {el.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/*<Grid item xs={12}>*/}
            {/*  <FormControl fullWidth>*/}
            {/*    <InputLabel id="tags-label">*/}
            {/*      <Iconify icon="eva:pricetags-outline" sx={{ mr: 1, pt: 1 }} />*/}
            {/*      Labels adhérents*/}
            {/*    </InputLabel>*/}
            {/*    <Select fullWidth labelId="tags-label" {...register('tags')} />*/}
            {/*  </FormControl>*/}
            {/*</Grid>*/}
            {/*<Grid item xs={12}>*/}
            {/*  <FormControl fullWidth>*/}
            {/*    <InputLabel id="vote-place-label">*/}
            {/*      <Iconify icon="lucide:school-2" sx={{ mr: 1, pt: 1 }} />*/}
            {/*      Bureau de vote*/}
            {/*    </InputLabel>*/}
            {/*    <Select fullWidth labelId="vote-place-label" {...register('votePlace')} />*/}
            {/*  </FormControl>*/}
            {/*</Grid>*/}
            {/*<Grid item xs={12}>*/}
            {/*  <FormControl fullWidth>*/}
            {/*    <InputLabel id="zone-label">*/}
            {/*      <Iconify icon="lucide:map-pin" sx={{ mr: 1, pt: 1 }} />*/}
            {/*      Zone géographique*/}
            {/*    </InputLabel>*/}
            {/*    <Select fullWidth labelId="zone-label" {...register('zone')} />*/}
            {/*  </FormControl>*/}
            {/*</Grid>*/}

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

export default memo(MandateFilters)
