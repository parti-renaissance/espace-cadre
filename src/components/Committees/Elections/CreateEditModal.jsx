import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Box } from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import * as Yup from 'yup'
import { useMutation } from '@tanstack/react-query'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { createDesignation, updateDesignation } from 'api/designations'
import { FormError } from 'components/shared/error/components'
import { useErrorHandler } from 'components/shared/error/hooks'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { notifyVariants } from 'components/shared/notification/constants'
import Input from 'ui/Input/Input'
import UIInputLabel from 'ui/InputLabel/InputLabel'
import { ModalForm } from 'ui/Dialog'

const messages = {
  create: 'Créer',
  update: 'Modifier',
  creationTitle: "Création d'une élection",
  editionTitle: "Modification de l'élection",
  createSuccess: "L'élection a été créée avec succès",
  editSuccess: "L'élection a été modifiée avec succès",
}

const fields = {
  customTitle: 'custom_title',
  voteStartDate: 'vote_start_date',
  voteEndDate: 'vote_end_date',
  description: 'description',
}

const designationSchema = Yup.object({
  customTitle: Yup.string().required('Le titre est obligatoire'),
  voteStartDate: Yup.date().required('La date de début de vote est requise'),
  voteEndDate: Yup.date().required('La date de fin de vote est requise'),
})

const CreateEditModal = ({ designation, committeeUuid, handleClose, onCreateResolve }) => {
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError, errorMessages } = useErrorHandler()
  const { control, getValues, reset, watch } = useForm({
    mode: 'onChange',
    resolver: yupResolver(designationSchema),
  })

  watch()

  const { mutate: createOrUpdate, isLoading } = useMutation(!designation ? createDesignation : updateDesignation, {
    onSuccess: designation => {
      onCreateResolve && onCreateResolve()
      enqueueSnackbar(designation ? messages.createSuccess : messages.editSuccess, notifyVariants.success)
      handleClose()
    },
    onError: handleError,
  })

  const values = getValues()

  const createOrEdit = () => {
    createOrUpdate({
      ...values,
      type: 'committee_supervisor',
      election_entity_identifier: committeeUuid,
    })
  }

  useEffect(() => {
    if (designation && designation.uuid) {
      reset(designation)
    }
  }, [designation, reset])

  return (
    <ModalForm
      title={designation ? messages.editionTitle : messages.creationTitle}
      handleClose={handleClose}
      createOrEdit={createOrEdit}
      isLoading={isLoading}
      submitLabel={designation ? messages.update : messages.create}
    >
      <Box>
        <UIInputLabel required>Titre</UIInputLabel>
        <Controller
          name={fields.customTitle}
          control={control}
          defaultValue={designation?.custom_title || ''}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Input
              name={fields.customTitle}
              onChange={onChange}
              placeholder="Titre de cette élection"
              value={value}
              autoFocus
            />
          )}
        />
        <FormError errors={errorMessages} field={fields.customTitle} />
      </Box>
      <Box>
        <UIInputLabel>Description</UIInputLabel>
        <Controller
          name={fields.description}
          control={control}
          defaultValue={designation?.description || ''}
          render={({ field: { value, onChange } }) => (
            <Input name={fields.description} value={value} onChange={onChange} multiline maxRows={4} />
          )}
        />
      </Box>
      <Box>
        <UIInputLabel required>Date de début du vote</UIInputLabel>
        <Controller
          name={fields.voteStartDate}
          control={control}
          defaultValue={designation?.vote_start_date || ''}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <DatePicker
              value={value}
              onChange={onChange}
              renderInput={params => <Input type="date" name={fields.voteStartDate} {...params} />}
            />
          )}
        />
        <FormError errors={errorMessages} field={fields.voteStartDate} />
      </Box>
      <Box>
        <UIInputLabel required>Date de fin du vote</UIInputLabel>
        <Controller
          name={fields.voteEndDate}
          control={control}
          defaultValue={designation?.vote_end_date || ''}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <DatePicker
              value={value}
              onChange={onChange}
              renderInput={params => <Input type="date" name={fields.voteEndDate} {...params} />}
            />
          )}
        />
        <FormError errors={errorMessages} field={fields.voteEndDate} />
      </Box>
    </ModalForm>
  )
}

export default CreateEditModal

CreateEditModal.propTypes = {
  designation: PropTypes.object,
  committeeUuid: PropTypes.string.isRequired,
  handleClose: PropTypes.func,
  onCreateResolve: PropTypes.func,
}
