import PropTypes from 'prop-types'
import { Box } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
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
  customTitle: 'customTitle',
  voteStartDate: 'voteStartDate',
  voteEndDate: 'voteEndDate',
  description: 'description',
}

const designationSchema = Yup.object({
  [fields.customTitle]: Yup.string().required('Le titre est obligatoire'),
  [fields.voteStartDate]: Yup.date().required('La date de début de vote est requise'),
  [fields.voteEndDate]: Yup.date().required('La date de fin de vote est requise'),
}).camelCase()

const CreateEditModal = ({ designation, committeeUuid, election, handleClose, onCreateResolve }) => {
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError, errorMessages } = useErrorHandler()
  const dateUpdateEnabled = election ? election.isDateEditable() : true
  const inputUpdateEnabled = election ? election.isEditable() : true
  const queryClient = useQueryClient()
  const {
    control,
    getValues,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: designationSchema.cast(designation),
    resolver: yupResolver(designationSchema),
  })

  const { mutate: createOrUpdate, isLoading } = useMutation(!designation.id ? createDesignation : updateDesignation, {
    onSuccess: () => {
      onCreateResolve && onCreateResolve()
      enqueueSnackbar(!designation.id ? messages.createSuccess : messages.editSuccess, notifyVariants.success)
      queryClient.invalidateQueries({ queryKey: 'committee-detail' })
      handleClose()
    },
    onError: handleError,
  })

  const prepareCreateOrUpdate = () => {
    const { customTitle, description, voteStartDate, voteEndDate } = getValues()

    return new Designation(null, customTitle, description, null, voteStartDate, voteEndDate)
  }

  const createOrEdit = () => {
    const { voteStartDate, voteEndDate } = getValues()
    if (compareAsc(voteStartDate, voteEndDate) === 1) {
      enqueueSnackbar('La date de fin de vote ne doit être supérieure à la date de début de vote', notifyVariants.error)
      return
    }

    if (!designation.id) {
      createOrUpdate({ ...prepareCreateOrUpdate(), committeeUuid })
    } else {
      createOrUpdate({
        ...getValues(),
        committeeUuid,
        id: designation.id,
      })
    }
  }

  return (
    <ModalForm
      title={designation.id ? messages.editionTitle : messages.creationTitle}
      handleClose={handleClose}
      createOrEdit={createOrEdit}
      isLoading={isLoading}
      disabledButton={!isValid}
      submitLabel={designation.id ? messages.update : messages.create}
    >
      <Box>
        <UIInputLabel required>Titre</UIInputLabel>
        <Controller
          name={fields.customTitle}
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Input
              name={fields.customTitle}
              placeholder="Titre de cette élection"
              disabled={!inputUpdateEnabled}
              {...field}
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
          render={({ field }) => (
            <Input name={fields.description} disabled={!inputUpdateEnabled} multiline {...field} maxRows={4} />
          )}
        />
      </Box>
      <Box>
        <UIInputLabel required>Date de début du vote</UIInputLabel>
        <Controller
          name={fields.voteStartDate}
          control={control}
          rules={{ required: true }}
          render={({ field: { ref, ...field } }) => (
            <DateTimePicker
              disabled={!dateUpdateEnabled}
              name={fields.voteStartDate}
              minDate={addDays(new Date(), 16)}
              slots={{ textField: Input }}
              {...field}
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
          rules={{ required: true }}
          render={({ field: { ref, ...field } }) => (
            <DateTimePicker
              disabled={!dateUpdateEnabled}
              name={fields.voteEndDate}
              minDate={addDays(new Date(), 17)}
              slots={{ textField: Input }}
              {...field}
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
  designation: Designation.propTypes,
  committeeUuid: PropTypes.string.isRequired,
  handleClose: PropTypes.func,
  election: CommitteeElection.propTypes,
  onCreateResolve: PropTypes.func,
}
