import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Box } from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import * as Yup from 'yup'
import { addDays, compareAsc } from 'date-fns'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createDesignation, updateDesignation } from 'api/designations'
import { FormError } from 'components/shared/error/components'
import { useErrorHandler } from 'components/shared/error/hooks'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { notifyVariants } from 'components/shared/notification/constants'
import { CommitteeElection, Designation } from 'domain/committee_election'
import Input from 'ui/Input/Input'
import UIInputLabel from 'ui/InputLabel/InputLabel'
import DateTimePicker from 'ui/DateTime/DateTimePicker'
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
  customTitle: 'title',
  customTitleError: 'custom_title',
  voteStartDate: 'voteStartDate',
  voteStartDateError: 'vote_start_date',
  voteEndDate: 'voteEndDate',
  voteEndDateError: 'vote_end_date',
  description: 'description',
}

const designationSchema = Yup.object({
  customTitleError: Yup.string().required('Le titre est obligatoire'),
  voteStartDateError: Yup.date().required('La date de début de vote est requise'),
  voteEndDateError: Yup.date().required('La date de fin de vote est requise'),
})

const CreateEditModal = ({ designation, committeeUuid, election, handleClose, onCreateResolve }) => {
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError, errorMessages } = useErrorHandler()
  const dateUpdateEnabled = election ? election.isDateEditable() : true
  const inputUpdateEnabled = election ? election.isEditable() : true
  const queryClient = useQueryClient()
  const { control, getValues, reset, watch } = useForm({
    mode: 'onChange',
    resolver: yupResolver(designationSchema),
  })

  watch()

  const { mutate: createOrUpdate, isLoading } = useMutation(!designation.id ? createDesignation : updateDesignation, {
    onSuccess: () => {
      onCreateResolve && onCreateResolve()
      enqueueSnackbar(!designation.id ? messages.createSuccess : messages.editSuccess, notifyVariants.success)
      queryClient.invalidateQueries({ queryKey: 'committee-detail' })
      handleClose()
    },
    onError: handleError,
  })

  const values = getValues()
  const formIsValid = !!values.title && !!values.voteStartDate && !!values.voteEndDate

  const prepareCreateOrUpdate = () => {
    const { title, description, voteStartDate, voteEndDate } = values

    return new Designation(null, title, description, null, voteStartDate, voteEndDate)
  }

  const createOrEdit = () => {
    const { voteStartDate, voteEndDate } = values
    if (compareAsc(voteStartDate, voteEndDate) === 1) {
      enqueueSnackbar('La date de fin de vote ne doit être supérieure à la date de début de vote', notifyVariants.error)
      return
    }

    if (!designation.id) {
      createOrUpdate({ ...prepareCreateOrUpdate(), committeeUuid })
    } else {
      createOrUpdate({
        ...values,
        committeeUuid,
        id: designation.id,
      })
    }
  }

  useEffect(() => {
    if (designation && designation.id) {
      reset(designation)
    }
  }, [designation, reset])

  return (
    <ModalForm
      title={designation.id ? messages.editionTitle : messages.creationTitle}
      handleClose={handleClose}
      createOrEdit={createOrEdit}
      isLoading={isLoading}
      disabledButton={!formIsValid}
      submitLabel={designation.id ? messages.update : messages.create}
    >
      <Box>
        <UIInputLabel required>Titre</UIInputLabel>
        <Controller
          name={fields.customTitle}
          control={control}
          defaultValue={designation.title}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Input
              name={fields.customTitle}
              onChange={onChange}
              placeholder="Titre de cette élection"
              value={value}
              disabled={!inputUpdateEnabled}
              autoFocus
            />
          )}
        />
        <FormError errors={errorMessages} field={fields.customTitleError} />
      </Box>
      <Box>
        <UIInputLabel>Description</UIInputLabel>
        <Controller
          name={fields.description}
          control={control}
          defaultValue={designation.description}
          render={({ field: { value, onChange } }) => (
            <Input
              name={fields.description}
              value={value}
              onChange={onChange}
              disabled={!inputUpdateEnabled}
              multiline
              maxRows={4}
            />
          )}
        />
      </Box>
      <Box>
        <UIInputLabel required>Date de début du vote</UIInputLabel>
        <Controller
          name={fields.voteStartDate}
          control={control}
          defaultValue={designation.voteStartDate}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <DateTimePicker
              value={value}
              onChange={onChange}
              disabled={!dateUpdateEnabled}
              name={fields.voteStartDate}
              minDate={addDays(new Date(), 16)}
              withTime
            />
          )}
        />
        <FormError errors={errorMessages} field={fields.voteStartDateError} />
      </Box>
      <Box>
        <UIInputLabel required>Date de fin du vote</UIInputLabel>
        <Controller
          name={fields.voteEndDate}
          control={control}
          defaultValue={designation.voteEndDate}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <DateTimePicker
              value={value}
              onChange={onChange}
              disabled={!dateUpdateEnabled}
              name={fields.voteEndDate}
              minDate={addDays(new Date(), 17)}
              withTime
            />
          )}
        />
        <FormError errors={errorMessages} field={fields.voteEndDateError} />
      </Box>
    </ModalForm>
  )
}

export default CreateEditModal

CreateEditModal.propTypes = {
  designation: Designation.propTypes,
  committeeUuid: PropTypes.string.isRequired,
  handleClose: PropTypes.func,
  election: CommitteeElection.propTypes,
  onCreateResolve: PropTypes.func,
}
