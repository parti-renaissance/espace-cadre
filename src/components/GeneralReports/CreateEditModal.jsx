import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Grid, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useForm, Controller } from 'react-hook-form'
import * as Yup from 'yup'
import { FilePond } from 'react-filepond'
import { useMutation } from '@tanstack/react-query'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { uploadFile } from 'api/upload'
import { createDocument, updateDocument } from 'api/general-meeting-report'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { useErrorHandler } from 'components/shared/error/hooks'
import { notifyVariants } from 'components/shared/notification/constants'
import { FormError } from 'components/shared/error/components'
import Button, { ActionButton } from 'ui/Button/Button'
import Dialog from 'ui/Dialog'
import UIInputLabel from 'ui/InputLabel/InputLabel'
import Input from 'ui/Input/Input'
import Title from 'ui/Title'
import Select from 'ui/Select'
import { useUserScope } from '../../redux/user/hooks'
import 'filepond/dist/filepond.min.css'

const messages = {
  create: 'Créer',
  update: 'Modifier',
  close: 'Fermer',
  creationTitle: "Ajout d'un procès-verbal d'AG",
  editionTitle: "Modification du procès-verbal d'AG",
  createSuccess: 'Procès-verbal créé avec succès',
  editSuccess: 'Le procès-verbal a bien été modifié',
  createAction: 'Procès-verbal en cours de création/édition',
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
  title: Yup.string().required('Le titre est obligatoire').min('2'),
  description: Yup.string().min('2'),
  date: Yup.date().required('La date est obligatoire'),
  zone: Yup.string().required('La zone est obligatoire'),
})

const CreateEditModal = ({ document, onCreateResolve, onUpdateResolve, handleClose }) => {
  const [currentScope] = useUserScope()
  const [files, setFiles] = useState(null)
  const [loading, setLoading] = useState(false)
  const [action, setAction] = useState('')
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError, errorMessages } = useErrorHandler()
  const { control, getValues, reset, watch } = useForm({
    mode: 'onChange',
    resolver: yupResolver(documentSchema),
  })

  watch()
  const zone = watch(fields.zone, document ? document.zone?.uuid : currentScope.zones[0].uuid)
  const values = getValues()

  useEffect(() => {
    if (document) {
      reset({ ...document, zone: document.zone.uuid })
    }
  }, [document, reset])

  const { mutateAsync: createOrUpdate } = useMutation(!document ? createDocument : updateDocument, {
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
    if ((!files || files.length === 0) && !document) {
      enqueueSnackbar(messages.fileErrorMessage, notifyVariants.error)
      return
    }

    let response = null
    setLoading(true)
    setAction(messages.createAction)

    try {
      response = await createOrUpdate({ ...values, zone })

      if (files && files.length > 0) {
        setAction(messages.uploadAction)
        uploadFormationFile({
          uuid: response?.uuid,
          file: files[0].file,
          endpoint: 'general_meeting_reports',
        })
      }

      enqueueSnackbar(!document ? messages.createSuccess : messages.editSuccess, notifyVariants.success)
      handleClose()
    } catch (error) {
      handleError(error)
    }

    setAction('')
    setFiles(null)
    setLoading(false)
  }

  return (
    <Dialog data-cy="document-create-edit" handleClose={handleClose} open>
      <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Title title={!document ? messages.creationTitle : messages.editionTitle} />
        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </Grid>

      <Box
        sx={{ mt: 4, position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}
        role="presentation"
      >
        <Box sx={{ flex: '1 1 0%' }} className="space-y-4">
          <Box>
            <UIInputLabel required>Titre</UIInputLabel>
            <Controller
              name={fields.title}
              control={control}
              defaultValue={document?.title || ''}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <Input name={fields.title} onChange={onChange} placeholder="Titre du PV" value={value} autoFocus />
              )}
            />
            <FormError errors={errorMessages} field={fields.title} />
          </Box>
          <Box>
            <UIInputLabel>Description</UIInputLabel>
            <Controller
              name={fields.description}
              control={control}
              defaultValue={document?.description || ''}
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
              defaultValue={document?.date}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  value={value}
                  onChange={onChange}
                  renderInput={params => <Input type="date" name={fields.date} {...params} />}
                />
              )}
            />
            <FormError errors={errorMessages} field={fields.date} />
          </Box>
          <Box>
            <UIInputLabel required={document ? false : true}>Votre fichier</UIInputLabel>
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
              defaultValue={zone}
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
        </Box>
        <Grid container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 4 }}>
          {action !== '' && (
            <Typography
              component="span"
              sx={{
                display: 'inline-block',
                mr: 1.5,
                fontSize: '14px',
                color: theme => theme.palette.colors.gray[500],
              }}
            >
              {action}...
            </Typography>
          )}
          <ActionButton type="submit" handleSubmit={createOrEdit} isLoading={loading}>
            {!document ? messages.create : messages.update}
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
  document: PropTypes.object,
  handleClose: PropTypes.func,
  onCreateResolve: PropTypes.func,
  onUpdateResolve: PropTypes.func,
}
