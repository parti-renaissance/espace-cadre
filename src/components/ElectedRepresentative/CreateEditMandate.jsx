import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Grid, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useForm, Controller } from 'react-hook-form'
import * as Yup from 'yup'
import { useMutation } from 'react-query'
import Dialog from 'ui/Dialog'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { useErrorHandler } from 'components/shared/error/hooks'
import { notifyVariants } from 'components/shared/notification/constants'
import { FormError } from 'components/shared/error/components'
import Button, { ActionButton } from 'ui/Button/Button'
import UIInputLabel from 'ui/InputLabel/InputLabel'
import Select from 'ui/Select/Select'
import { Title } from './CreateEditModal'
import { mandats } from 'shared/constants'

const messages = {
  create: 'Créer',
  update: 'Modifier',
  close: 'Fermer',
  creationTitle: "Ajout d'un mandat",
  editionTitle: 'Modification du mandat',
  createSuccess: 'Mandat créé avec succès',
  editSuccess: 'Le mandat a bien été modifié',
}

const fields = {
  type: 'type',
  geoZone: 'geo_zone',
  onGoing: 'on_going',
  beginAt: 'begin_at',
  finishAt: 'finish_at',
  isElected: 'is_elected',
  laREMSupport: 'la_r_e_m_support',
  politicalAffiliation: 'political_affiliation',
  electedRepresentative: 'elected_representative',
}

const mandateSchema = Yup.object({
  type: Yup.string().required('Le type de mandat est obligatoire'),
  beginAt: Yup.date().required('La date de début est obligatoire'),
  electedRepresentative: Yup.string().required("L'élu est obligatoire"),
  geoZone: Yup.string().required('La zone géographique est obligatoire'),
  isElected: Yup.boolean().optional(),
  laREMSupport: Yup.boolean().optional(),
  onGoing: Yup.boolean().optional(),
  finishAt: Yup.date().optional(),
})

const CreateEditMandate = ({ electedId, mandate, onUpdateResolve, handleClose }) => {
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError, errorMessages } = useErrorHandler()
  const { control, getValues, reset, watch } = useForm({
    mode: 'onChange',
    resolver: yupResolver(mandateSchema),
  })

  watch()

  const values = getValues()

  const { mutate: createOrUpdate, isLoading } = useMutation(!mandate ? () => {} : () => {}, {
    onSuccess: mandate => {
      onUpdateResolve && onUpdateResolve()
      enqueueSnackbar(mandate ? messages.createSuccess : messages.editSuccess, notifyVariants.success)
      handleClose()
    },
    onError: handleError,
  })

  const createOrEdit = () => {
    createOrUpdate({ ...values, elected_representative: electedId, uuid: mandate?.uuid })
  }

  useEffect(() => {
    if (mandate && mandate.uuid) {
      reset(mandate)
    }
  }, [mandate, reset])

  return (
    <Dialog data-cy="mandate-create-edit" handleClose={handleClose} open>
      <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Title>{!mandate ? messages.creationTitle : messages.editionTitle}</Title>
        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </Grid>
      <Box
        sx={{ mt: 4, position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}
        role="presentation"
      >
        <Box sx={{ flex: '1 1 0%' }}>
          <Box sx={{ mt: 2 }}>
            <UIInputLabel required>Type de Mandat</UIInputLabel>
            <Controller
              name={fields.type}
              control={control}
              defaultValue={mandate?.type || ''}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <Select
                  options={Object.keys(mandats).map(key => ({ key, value: mandats[key] }))}
                  onChange={onChange}
                  value={value}
                  sx={{
                    display: 'flex',
                    border: '1px solid',
                    borderColor: theme => theme.palette.colors.gray[300],
                    mt: 1.5,
                    borderRadius: '8px',
                  }}
                />
              )}
            />
            <FormError errors={errorMessages} field={fields.type} />
          </Box>
        </Box>
        <Grid container sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <ActionButton type="submit" handleSubmit={createOrEdit} isLoading={isLoading}>
            {!mandate ? messages.create : messages.update}
          </ActionButton>
          <Button onClick={handleClose} aria-label="close" isMainButton>
            {messages.close}
          </Button>
        </Grid>
      </Box>
    </Dialog>
  )
}

export default CreateEditMandate

CreateEditMandate.propTypes = {
  electedId: PropTypes.string,
  mandate: PropTypes.object,
  onUpdateResolve: PropTypes.func,
  handleClose: PropTypes.func,
}
