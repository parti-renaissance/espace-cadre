import { useState } from 'react'
import PropTypes from 'prop-types'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Typography } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import * as Yup from 'yup'
import { FilePond } from 'react-filepond'
import { useMutation } from '@tanstack/react-query'
import { DateTimePicker } from '@mui/x-date-pickers'
import { uploadFile } from 'api/upload'
import { createDocument, updateDocument } from 'api/general-meeting-report'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { useErrorHandler } from 'components/shared/error/hooks'
import { notifyVariants } from 'components/shared/notification/constants'
import { FormError } from 'components/shared/error/components'
import { ModalForm } from 'ui/Dialog'
import UIInputLabel from 'ui/InputLabel/InputLabel'
import Input from 'ui/Input/Input'
import Select from 'ui/Select'
import { useUserScope } from '../../redux/user/hooks'
import 'filepond/dist/filepond.min.css'

const messages = {
  create: 'Créer',
  update: 'Modifier',
  close: 'Fermer',
  creationTitle: "Ajout d'une archive",
  editionTitle: "Modification de l'archive",
  createSuccess: 'Archive créée avec succès',
  editSuccess: "L'archive a bien été modifiée",
  createAction: "Création de l'archive en cours",
  uploadAction: "Fichier en cours d'upload",
  fileErrorMessage: 'Le fichier est obligatoire',
}

const fields = {
  title: 'title',
  description: 'description',
  date: 'date',
  zone: 'zone',
}

const documentSchema = Yup.object({
  [fields.title]: Yup.string().required('Le titre est obligatoire').min('2'),
  [fields.description]: Yup.string().min('2'),
  [fields.date]: Yup.date().required('La date est obligatoire'),
  [fields.zone]: Yup.string().required('La zone est obligatoire'),
}).camelCase()

const CreateEditModal = ({ document, onCreateResolve, onUpdateResolve, handleClose }) => {
  const [currentScope] = useUserScope()
  const [files, setFiles] = useState(null)
  const [loading, setLoading] = useState(false)
  const [action, setAction] = useState('')
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError, errorMessages } = useErrorHandler()
  const { control, getValues } = useForm({
    mode: 'onChange',
    defaultValues: documentSchema.cast({ ...document, zone: document.id ? document.zone : currentScope.zones[0].uuid }),
    resolver: yupResolver(documentSchema),
  })

  const { mutateAsync: createOrUpdate } = useMutation(!document.id ? createDocument : updateDocument, {
    onSuccess: () => {
      onCreateResolve && onCreateResolve()
      onUpdateResolve && onUpdateResolve()
    },
    onError: handleError,
  })

  const { mutate: uploadFormationFile } = useMutation(uploadFile, {
    onSuccess: () => {
      setAction('')
    },
    onError: handleError,
  })

  const createOrEdit = async () => {
    if ((!files || files.length === 0) && !document.id) {
      enqueueSnackbar(messages.fileErrorMessage, notifyVariants.error)
      return
    }

    let response = null
    setLoading(true)
    setAction(messages.createAction)

    try {
      response = await createOrUpdate(getValues())

      if (files && files.length > 0) {
        setAction(messages.uploadAction)
        uploadFormationFile({
          uuid: response?.uuid,
          file: files[0].file,
          endpoint: 'general_meeting_reports',
        })
      }

      enqueueSnackbar(!document.id ? messages.createSuccess : messages.editSuccess, notifyVariants.success)
      handleClose()
    } catch (error) {
      handleError(error)
    }

    setAction('')
    setFiles(null)
    setLoading(false)
  }

  return (
    <ModalForm
      handleClose={handleClose}
      title={!document.id ? messages.creationTitle : messages.editionTitle}
      submitLabel={!document.id ? messages.create : messages.update}
      isLoading={loading}
      createOrEdit={createOrEdit}
      actions={
        <>
          {action !== '' && (
            <Typography
              component="span"
              sx={{
                display: 'inline-block',
                mr: 1.5,
                fontSize: '14px',
                color: 'colors.gray.500',
              }}
            >
              {action}...
            </Typography>
          )}
        </>
      }
    >
      <Box>
        <UIInputLabel required>Titre</UIInputLabel>
        <Controller
          name={fields.title}
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Input name={fields.title} onChange={onChange} placeholder="Titre de l'archive" value={value} autoFocus />
          )}
        />
        <FormError errors={errorMessages} field={fields.title} />
      </Box>
      <Box>
        <UIInputLabel>Description</UIInputLabel>
        <Controller
          name={fields.description}
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input name={fields.description} onChange={onChange} value={value} multiline maxRows={4} />
          )}
        />
        <FormError errors={errorMessages} field={fields.description} />
      </Box>
      <Box>
        <UIInputLabel required>Date</UIInputLabel>
        <Controller
          name={fields.date}
          control={control}
          rules={{ required: true }}
          render={({ field: { ref, ...field } }) => (
            <DateTimePicker slots={{ textField: Input }} maxDate={new Date()} {...field} />
          )}
        />
        <FormError errors={errorMessages} field={fields.date} />
      </Box>
      <Box>
        <UIInputLabel required={!document.id}>Votre fichier</UIInputLabel>
        <FilePond
          files={files}
          onupdatefiles={setFiles}
          allowProcess={false}
          labelIdle='Glissez-déposez votre fichier ou <span class="filepond--label-action">parcourir</span>'
        />
      </Box>
      <Box>
        <UIInputLabel required>Zone</UIInputLabel>
        <Controller
          name={fields.zone}
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Select
              options={currentScope.zones.map(z => ({ key: z.uuid, value: `${z.name} (${z.code})` }))}
              onChange={onChange}
              value={value}
              disabled={currentScope.zones.length === 1}
            />
          )}
        />
        <FormError errors={errorMessages} field={fields.zone} />
      </Box>
    </ModalForm>
  )
}

export default CreateEditModal

CreateEditModal.propTypes = {
  document: PropTypes.object,
  handleClose: PropTypes.func,
  onCreateResolve: PropTypes.func,
  onUpdateResolve: PropTypes.func,
}
