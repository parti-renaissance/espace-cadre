import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { Grid, Box, Typography, FormControlLabel } from '@mui/material'
import { styled } from '@mui/system'
import { yupResolver } from '@hookform/resolvers/yup'
import { DatePicker } from '@mui/x-date-pickers'
import { useForm, Controller } from 'react-hook-form'
import * as Yup from 'yup'
import { useMutation } from '@tanstack/react-query'
import { generatePath, useNavigate } from 'react-router'
import { createElected, updateElected } from 'api/elected-representative'
import { FormError } from 'components/shared/error/components'
import { useErrorHandler } from 'components/shared/error/hooks'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { notifyVariants } from 'components/shared/notification/constants'
import AdherentAutocomplete from 'components/Filters/Element/AdherentAutocomplete'
import Input from 'ui/Input/Input'
import UIInputLabel from 'ui/InputLabel/InputLabel'
import Select from 'ui/Select/Select'
import { ModalForm } from 'ui/Dialog'
import { Checkbox } from 'ui/Checkbox/Checkbox'
import paths from 'shared/paths'

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
  <Box sx={{ pb: 1.5, mb: 2, borderBottom: '1px solid', borderBottomColor: 'colors.gray.300' }}>
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
  creationTitle: "Creation d'un élu",
  editionTitle: "Modification de l'élu",
  createSuccess: 'Élu créé avec succès',
  editSuccess: "L'élu a bien été modifié",
}

const fields = {
  firstName: 'firstName',
  lastName: 'lastName',
  gender: 'gender',
  birthDate: 'birthDate',
  birthPlace: 'birthPlace',
  contactPhone: 'contactPhone',
  contactEmail: 'contactEmail',
  hasFollowedTraining: 'hasFollowedTraining',
}

const electedSchema = Yup.object({
  [fields.firstName]: Yup.string().required('Le nom est obligatoire'),
  [fields.lastName]: Yup.string().required('Le prénom est obligatoire'),
  [fields.gender]: Yup.string().required('Le genre est obligatoire'),
  [fields.birthDate]: Yup.date().required('La date de naissance est obligatoire'),
  [fields.contactEmail]: Yup.string().email("L'email est invalide"),
}).camelCase()

const CreateEditModal = ({ elected, handleClose, onCreateResolve, onUpdateResolve }) => {
  const [selectedAdherent, setSelectedAdherent] = useState(null)
  const { enqueueSnackbar } = useCustomSnackbar()
  const navigate = useNavigate()
  const { handleError, errorMessages } = useErrorHandler()
  const { control, getValues } = useForm({
    mode: 'onChange',
    defaultValues: electedSchema.cast(elected),
    resolver: yupResolver(electedSchema),
  })

  const { mutate: createOrUpdate, isLoading } = useMutation(!elected.id ? createElected : updateElected, {
    onSuccess: electedRepresentative => {
      onCreateResolve && onCreateResolve()
      onUpdateResolve && onUpdateResolve()

      enqueueSnackbar(
        elected.id && elected.id === electedRepresentative.uuid ? messages.editSuccess : messages.createSuccess,
        notifyVariants.success
      )
      handleClose()

      if (!elected.id) {
        navigate(generatePath(`${paths.elected_representative}/:uuid`, { uuid: electedRepresentative.uuid }))
      }
    },
    onError: handleError,
  })

  const createOrEdit = () => {
    createOrUpdate({ ...getValues(), id: elected.id, adherent: selectedAdherent?.uuid })
  }

  useEffect(() => {
    if (elected && elected.id) {
      if (elected.adherent) setSelectedAdherent(elected.adherent)
    }
  }, [elected])

  return (
    <ModalForm
      title={!elected.id ? messages.creationTitle : messages.editionTitle}
      handleClose={handleClose}
      createOrEdit={createOrEdit}
      isLoading={isLoading}
      submitLabel={!elected.id ? messages.create : messages.update}
    >
      <Box>
        <UIInputLabel required>Prénom</UIInputLabel>
        <Controller
          name={fields.firstName}
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Input name={fields.firstName} onChange={onChange} placeholder="Nom de l'élu" value={value} autoFocus />
          )}
        />
        <FormError errors={errorMessages} field={fields.firstName} />
      </Box>
      <Box sx={{ mt: 2 }}>
        <UIInputLabel required>Nom</UIInputLabel>
        <Controller
          name={fields.lastName}
          control={control}
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
          rules={{ required: true }}
          render={({ field: { ref, ...field } }) => <DatePicker slots={{ textField: Input }} {...field} />}
        />
        <FormError errors={errorMessages} field={fields.birthDate} />
      </Box>
      <Box sx={{ mt: 2 }}>
        <UIInputLabel>Lieu de naissance</UIInputLabel>
        <Controller
          name={fields.birthPlace}
          control={control}
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
            <AdherentAutocomplete
              customStyle={{ bgcolor: 'colors.gray.50' }}
              value={selectedAdherent}
              onChange={setSelectedAdherent}
            />
          </Grid>
        </Box>
      </Box>
    </ModalForm>
  )
}

export default CreateEditModal

CreateEditModal.propTypes = {
  elected: PropTypes.object,
  handleClose: PropTypes.func,
  onCreateResolve: PropTypes.func,
  onUpdateResolve: PropTypes.func,
}
