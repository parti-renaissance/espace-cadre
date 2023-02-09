import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { Grid, Box, Typography, IconButton, FormControlLabel } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { styled } from '@mui/system'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import * as Yup from 'yup'
import { useMutation } from 'react-query'
import Autocomplete from 'components/Filters/Element/Autocomplete'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { FormError } from 'components/shared/error/components'
import { useErrorHandler } from 'components/shared/error/hooks'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { notifyVariants } from 'components/shared/notification/constants'
import Button, { ActionButton } from 'ui/Button/Button'
import Input from 'ui/Input/Input'
import UIInputLabel from 'ui/InputLabel/InputLabel'
import Select from 'ui/Select/Select'
import Dialog from 'ui/Dialog'
import { Checkbox } from 'ui/Checkbox/Checkbox'
import { activistAutocompleteUri } from 'api/activist'
import { createElected, updateElected } from 'api/elected-representative'
import { generatePath, useNavigate } from 'react-router'
import paths from 'shared/paths'

const Title = styled(Typography)(
  ({ theme }) => `
  color: ${theme.palette.colors.gray[900]};
  font-size: 1.525rem;
  line-height: 1.75rem;
  font-weight: 500;
`
)

const FormTitle = styled(Typography)(
  ({ theme }) => `
  display: block;
  color: ${theme.palette.colors.gray[900]};
  font-size: 0.975rem;
  line-height: 1.5rem;
  font-weight: 500;
`
)

const FormDescription = styled(Typography)(
  ({ theme }) => `
  display: block;
  color: ${theme.palette.colors.gray[500]};
  font-size: 0.875rem;
  line-height: 1.25rem;
  margin-top: 0.25rem;
`
)

export const FormHeading = ({ title, description }) => (
  <Box sx={{ pb: 1.5, mb: 2, borderBottom: '1px solid', borderBottomColor: theme => theme.palette.colors.gray[300] }}>
    <FormTitle>{title}</FormTitle>
    <FormDescription>{description}</FormDescription>
  </Box>
)

FormHeading.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
}

const messages = {
  create: 'Créer',
  update: 'Modifier',
  close: 'Fermer',
  creationTitle: "Creation d'un élu",
  editionTitle: "Modification de l'élu",
  createSuccess: 'Élu créé avec succès',
  editSuccess: "L'élu a bien été modifié",
}

const fields = {
  firstName: 'first_name',
  lastName: 'last_name',
  gender: 'gender',
  birthDate: 'birth_date',
  birthPlace: 'birth_place',
  contactPhone: 'contact_phone',
  contactEmail: 'contact_email',
  hasFollowedTraining: 'has_followed_training',
}

const electedSchema = Yup.object({
  firstName: Yup.string().required('Le nom est obligatoire'),
  lastName: Yup.string().required('Le prénom est obligatoire'),
  gender: Yup.string().required('Le genre est obligatoire'),
  birthDate: Yup.date().required('La date de naissance est obligatoire'),
  contactEmail: Yup.string().email("L'email est invalide"),
})

const CreateEditModal = ({ elected, handleClose, onCreateResolve, onUpdateResolve }) => {
  const [selectedAdherent, setSelectedAdherent] = useState(null)
  const { enqueueSnackbar } = useCustomSnackbar()
  const navigate = useNavigate()
  const { handleError, errorMessages } = useErrorHandler()
  const { control, getValues, reset, watch } = useForm({
    mode: 'onChange',
    resolver: yupResolver(electedSchema),
  })

  watch()

  const { mutate: createOrUpdate, isLoading } = useMutation(!elected ? createElected : updateElected, {
    onSuccess: elected => {
      onCreateResolve && onCreateResolve()
      onUpdateResolve && onUpdateResolve()
      enqueueSnackbar(elected ? messages.createSuccess : messages.editSuccess, notifyVariants.success)
      handleClose()
      navigate(generatePath(`${paths.elected_representative}/:uuid`, { uuid: elected.uuid }))
    },
    onError: handleError,
  })

  const values = getValues()

  const createOrEdit = () => {
    createOrUpdate({ ...values, adherent: selectedAdherent?.uuid, uuid: elected?.uuid })
  }

  useEffect(() => {
    if (elected && elected.uuid) {
      reset(elected)
    }
  }, [elected, reset])

  return (
    <Dialog data-cy="elected-create-edit" handleClose={handleClose} open>
      <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Title>{!elected ? messages.creationTitle : messages.editionTitle}</Title>
        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </Grid>
      <Box
        sx={{ mt: 4, position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}
        role="presentation"
      >
        <Box sx={{ flex: '1 1 0%' }}>
          <Box>
            <UIInputLabel required>Nom</UIInputLabel>
            <Controller
              name={fields.firstName}
              control={control}
              defaultValue={elected?.first_name}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <Input name={fields.firstName} onChange={onChange} placeholder="Nom de l'élu" value={value} autoFocus />
              )}
            />
            <FormError errors={errorMessages} field={fields.firstName} />
          </Box>
          <Box sx={{ mt: 2 }}>
            <UIInputLabel required>Prénom</UIInputLabel>
            <Controller
              name={fields.lastName}
              control={control}
              defaultValue={elected?.last_name}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <Input
                  name={fields.lastName}
                  onChange={onChange}
                  placeholder="Prénom de l'élu"
                  value={value === null ? '' : value}
                />
              )}
            />
            <FormError errors={errorMessages} field={fields.lastName} />
          </Box>
          <Box sx={{ mt: 2 }}>
            <UIInputLabel>Adresse E-mail</UIInputLabel>
            <Controller
              name={fields.contactEmail}
              control={control}
              defaultValue={elected?.contact_email}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <Input name={fields.contactEmail} onChange={onChange} value={value === null ? '' : value} />
              )}
            />
            <FormError errors={errorMessages} field={fields.contactEmail} />
          </Box>
          <Box sx={{ mt: 2 }}>
            <UIInputLabel required>Date de naissance</UIInputLabel>
            <Controller
              name={fields.birthDate}
              control={control}
              defaultValue={elected?.birth_date}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  value={value}
                  onChange={onChange}
                  renderInput={params => <Input type="date" name={fields.birthDate} {...params} />}
                />
              )}
            />
            <FormError errors={errorMessages} field={fields.birthDate} />
          </Box>
          <Box sx={{ mt: 2 }}>
            <UIInputLabel>Lieu de naissance</UIInputLabel>
            <Controller
              name={fields.birthPlace}
              control={control}
              defaultValue={elected?.birth_place}
              render={({ field: { onChange, value } }) => (
                <Input name={fields.birthPlace} onChange={onChange} value={value === null ? '' : value} />
              )}
            />
            <FormError errors={errorMessages} field={fields.birthPlace} />
          </Box>
          <Box sx={{ mt: 2 }}>
            <UIInputLabel required>Genre</UIInputLabel>
            <Controller
              name={fields.gender}
              control={control}
              defaultValue={elected?.gender || 'male'}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <Select
                  options={[
                    { key: 'male', value: 'Homme' },
                    { key: 'female', value: 'Femme' },
                  ]}
                  onChange={onChange}
                  value={value}
                  sx={{ display: 'flex' }}
                />
              )}
            />
            <FormError errors={errorMessages} field={fields.gender} />
            <Controller
              name={fields.hasFollowedTraining}
              control={control}
              defaultValue={elected?.has_followed_training}
              render={({ field: { onChange, value } }) => (
                <FormControlLabel
                  name={fields.hasFollowedTraining}
                  label="Formation Tous Politiques !"
                  onChange={onChange}
                  control={<Checkbox checked={value} />}
                  sx={{ pt: 2 }}
                />
              )}
            />
          </Box>
          <Box sx={{ mt: 4 }}>
            <FormHeading title="Identité adhérent" description="Ces informations sont celles du profil de l'adhérent" />
            <Box sx={{ mt: 2 }}>
              <Grid item xs={12}>
                <Autocomplete
                  placeholder="Rechercher un adhérent"
                  customStyle={{ bgcolor: theme => theme.palette.colors.gray[50] }}
                  uri={activistAutocompleteUri}
                  queryParam="q"
                  valueParam="uuid"
                  value={selectedAdherent}
                  onChange={v => {
                    setSelectedAdherent(v.uuid ? v : null)
                  }}
                  renderOption={(props, option) => (
                    <li key={option.uuid} {...props}>
                      {option.first_name} {option.last_name}
                    </li>
                  )}
                  getOptionLabel={option => `${option.first_name} ${option.last_name}`}
                />
              </Grid>
            </Box>
          </Box>
        </Box>
        <Grid container sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <ActionButton type="submit" handleSubmit={createOrEdit} isLoading={isLoading}>
            {!elected ? messages.create : messages.update}
          </ActionButton>
          <Button onClick={handleClose} aria-label="close" isMainButton>
            {messages.close}
          </Button>
        </Grid>
      </Box>
    </Dialog>
  )
}

export default CreateEditModal

CreateEditModal.propTypes = {
  elected: PropTypes.object,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  onCreateResolve: PropTypes.func,
  onUpdateResolve: PropTypes.func,
}
