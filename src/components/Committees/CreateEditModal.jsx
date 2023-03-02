import { forwardRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Grid, Container, Dialog, Slide, Box, Tabs, Tab, Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { Close as CloseIcon } from '@mui/icons-material/'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { FormError } from 'components/shared/error/components'
import { useErrorHandler } from 'components/shared/error/hooks'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { notifyVariants } from 'components/shared/notification/constants'
import UIInputLabel from 'ui/InputLabel/InputLabel'
import Input from 'ui/Input/Input'
import Title from 'ui/Title'
import Button from 'ui/Button'
import ZonesList from './ZonesList'
import { createCommittee, getCommittee, updateCommittee } from 'api/committees'
import Loader from 'ui/Loader'
import { useQueryWithScope } from 'api/useQueryWithScope'
import ZonesAccordion from './Zone/Accordions'
import Map from './Map'
import TabPanel from './Panel'
import ZoneContext from './zoneContext'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const messages = {
  creationTitle: "Création d'un comité",
  editionTitle: 'Modification du comité',
  selectedTitle: 'Zones sélectionnées',
  create: 'Créer',
  edit: 'Modifier',
  createSuccess: 'Comité créé avec succès',
  editSuccess: 'Le comité a bien été modifié',
  recapTab: 'Récapitulatif',
  mapTab: 'Carte',
}

const fields = {
  name: 'name',
  description: 'description',
  zones: 'zones',
}

const committeeSchema = Yup.object({
  name: Yup.string().required('Le nom est obligatoire'),
  zones: Yup.array().required('Les zones sont obligatoire'),
})

const CreateEditModal = ({ open, handleClose, committeeId, onCreateResolve, onUpdateResolve }) => {
  const isCreateMode = committeeId === '-1'
  const { handleError, errorMessages } = useErrorHandler()
  const { enqueueSnackbar } = useCustomSnackbar()
  const [committee, setCommittee] = useState(null)
  const [currentTab, setCurrentTab] = useState(0)
  const [zones, setZones] = useState([])

  const { control, getValues, watch, reset, setValue } = useForm({
    mode: 'onChange',
    resolver: yupResolver(committeeSchema),
  })

  const { isLoading: isSingleCommitteeLoading } = useQueryWithScope(
    ['single-committee', committeeId, { feature: 'Committees', view: 'Committees' }],
    () => getCommittee(committeeId),
    {
      enabled: !isCreateMode,
      onSuccess: setCommittee,
    }
  )

  const { mutateAsync: createOrUpdateCommittee, isLoading: isCommitteeLoading } = useMutation(
    isCreateMode ? createCommittee : updateCommittee,
    {
      onSuccess: () => {
        onCreateResolve && onCreateResolve()
        onUpdateResolve && onUpdateResolve()
        enqueueSnackbar(isCreateMode ? messages.createSuccess : messages.editSuccess, notifyVariants.success)
        handleClose()
      },
      onError: handleError,
    }
  )

  watch()
  const values = getValues()

  const createOrEdit = () => createOrUpdateCommittee({ ...values, zones: zones.map(zone => zone.uuid) })

  useEffect(() => {
    if (committee?.uuid) {
      setZones(committee.zones)
      reset(committee)
    }
  }, [committee, reset])

  return (
    <ZoneContext.Provider value={{ zones, setZones }}>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <Container maxWidth="xl">
          <Grid container sx={{ py: 4 }}>
            <Grid item xs={12} md={9} sx={{ display: 'flex', alignItems: 'center' }} className="space-x-2">
              <Title title={isCreateMode ? messages.creationTitle : messages.editionTitle} />
              {!isCreateMode && isSingleCommitteeLoading ? <Loader /> : null}
            </Grid>
            <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" rootProps={{ sx: { color: 'whiteCorner', mr: 4 } }} onClick={createOrEdit}>
                {isCommitteeLoading && <Loader color="whiteCorner" />}&nbsp;
                {isCreateMode ? messages.create : messages.edit}
              </Button>
              <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Grid
            container
            sx={{ borderRadius: '12px', background: 'whiteCorner', pb: 1 }}
            columnSpacing={4}
            className="main"
          >
            <Grid item xs={12} md={6} className="space-y-4 pr-10">
              <Box>
                <UIInputLabel required>Nom du comité</UIInputLabel>
                <Controller
                  name={fields.name}
                  control={control}
                  defaultValue={committee?.name || ''}
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <Input name={fields.name} onChange={onChange} value={value} autoFocus />
                  )}
                />
                <FormError errors={errorMessages} field={fields.name} />
              </Box>
              <Box>
                <UIInputLabel>Description</UIInputLabel>
                <Controller
                  name={fields.description}
                  control={control}
                  defaultValue={committee?.description || ''}
                  render={({ field: { onChange, value } }) => (
                    <Input name={fields.description} onChange={onChange} value={value} multiline maxRows={4} />
                  )}
                />
              </Box>
              <Box>
                <FormError errors={errorMessages} field={fields.zones} />
                <ZonesList />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: theme => theme.palette.colors.gray[200],
                  position: 'sticky',
                  top: '1rem',
                }}
              >
                <Tabs value={currentTab} onChange={(e, v) => setCurrentTab(v)} aria-label="basic tabs example">
                  <Tab label={messages.mapTab} id="tab-0" aria-controls="tabpanel-0" />
                  <Tab label={messages.recapTab} id="tab-1" aria-controls="tabpanel-1" />
                </Tabs>
                <TabPanel value={currentTab} index={0}>
                  <Map />
                </TabPanel>
                <TabPanel value={currentTab} index={1}>
                  <Typography variant="h4" sx={{ fontSize: '18px', color: theme => theme.palette.colors.blue[500] }}>
                    {messages.selectedTitle} ({zones.length})
                  </Typography>
                  <Box className="mt-5">
                    <ZonesAccordion
                      selectedZones={zones}
                      onRemoveZone={zone => {
                        setZones(zones.filter(z => z.uuid !== zone.uuid))
                        setValue(
                          fields.zones,
                          zones.filter(z => z.uuid !== zone.uuid).map(zone => zone.uuid)
                        )
                      }}
                    />
                  </Box>
                </TabPanel>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Dialog>
    </ZoneContext.Provider>
  )
}

export default CreateEditModal

CreateEditModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  committeeId: PropTypes.string,
  onCreateResolve: PropTypes.func,
  onUpdateResolve: PropTypes.func,
}
