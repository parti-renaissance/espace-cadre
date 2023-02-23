import { forwardRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Grid, Container, Dialog, Slide, Box } from '@mui/material'
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

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const messages = {
  creationTitle: "Création d'un comité",
  editionTitle: 'Modification du comité',
  create: 'Créer',
  edit: 'Modifier',
  createSuccess: 'Comité créé avec succès',
  editSuccess: 'Le comité a bien été modifié',
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
      onSuccess: data => {
        setCommittee(data)
      },
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

  const createOrEdit = () => {
    delete values.types
    delete values.q

    createOrUpdateCommittee(values)
  }

  useEffect(() => {
    if (committee?.uuid) {
      setZones(committee.zones.map(zone => zone.uuid))
      reset(committee)
    }
  }, [committee, reset])

  return (
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
              <ZonesList
                watch={watch}
                control={control}
                setValue={setValue}
                zones={zones}
                updatedSelectedZones={zones => {
                  setZones(zones)
                  setValue(fields.zones, zones)
                }}
              />
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              minHeight: '750px',
              height: '100%',
              borderRadius: '8px',
              backgroundColor: theme => theme.palette.colors.gray[50],
            }}
          />
        </Grid>
      </Container>
    </Dialog>
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
