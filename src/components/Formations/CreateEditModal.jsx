import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Grid, IconButton, FormControlLabel, RadioGroup, Radio, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useForm, Controller } from 'react-hook-form'
import * as Yup from 'yup'
import { FilePond } from 'react-filepond'
import { useMutation } from 'react-query'
import { createFormation, updateFormation, uploadFile } from 'api/formations'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { useErrorHandler } from 'components/shared/error/hooks'
import { notifyVariants } from 'components/shared/notification/constants'
import { FormError } from 'components/shared/error/components'
import Button, { ActionButton } from 'ui/Button/Button'
import Dialog from 'ui/Dialog'
import UIInputLabel from 'ui/InputLabel/InputLabel'
import Input from 'ui/Input/Input'
import { Checkbox } from 'ui/Checkbox/Checkbox'
import Title from 'ui/Title'
import Select from 'ui/Select'
import { useUserScope } from '../../redux/user/hooks'
import 'filepond/dist/filepond.min.css'

const messages = {
  create: 'Créer',
  update: 'Modifier',
  close: 'Fermer',
  creationTitle: "Ajout d'une formation",
  editionTitle: 'Modification de la formation',
  createSuccess: 'Formation créée avec succès',
  editSuccess: 'La formation a bien été modifiée',
  deleteSuccess: 'La formation a bien été supprimée',
  createAction: 'Formation en cours de création',
  uploadAction: "Fichier en cours d'upload",
}

const fields = {
  title: 'title',
  description: 'description',
  contentType: 'content_type',
  published: 'published',
  link: 'link',
  zone: 'zone',
  position: 'position',
}

const formationSchema = Yup.object({
  title: Yup.string().required('Le titre est obligatoire'),
  contentType: Yup.string().required('Le type de contenu est obligatoire'),
  zone: Yup.string().required('La zone est obligatoire'),
})

const UISelect = ({ options, ...props }) => (
  <Select
    options={options}
    sx={{
      display: 'flex',
      border: '1px solid',
      borderColor: theme => theme.palette.colors.gray[300],
      mt: 1.5,
      borderRadius: '8px',
      overflow: 'hidden',
    }}
    {...props}
  />
)

UISelect.propTypes = {
  options: PropTypes.array.isRequired,
}

const CreateEditModal = ({ formation, onCreateResolve, onUpdateResolve, handleClose }) => {
  const [currentScope] = useUserScope()
  const [files, setFiles] = useState(null)
  const [loading, setLoading] = useState(false)
  const [action, setAction] = useState('')
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError, errorMessages } = useErrorHandler()
  const { control, getValues, reset, watch } = useForm({
    mode: 'onChange',
    resolver: yupResolver(formationSchema),
  })

  const contentType = watch(fields.contentType, 'link')
  const zone = watch(fields.zone, formation?.zone?.uuid || '')
  const position = watch(fields.position, formation ? parseInt(formation.position) : 0)
  const values = getValues()
  watch()

  useEffect(() => {
    if (formation) {
      reset({ ...formation, zone: formation.zone.uuid })
    }
  }, [formation, reset])

  const { mutateAsync: createOrUpdate } = useMutation(!formation ? createFormation : updateFormation, {
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
    let response = null
    setLoading(true)
    setAction(messages.createAction)

    try {
      response = await createOrUpdate({ ...values, position: parseInt(position), zone })
    } catch (error) {
      handleError(error)
    } finally {
      setAction(messages.uploadAction)
      if (contentType === 'file' && files?.length) {
        uploadFormationFile({ uuid: response?.uuid, file: files[0].file })
      }

      setAction('')
      setFiles(null)
      setLoading(false)

      onUpdateResolve && onUpdateResolve()
      enqueueSnackbar(!formation ? messages.createSuccess : messages.editSuccess, notifyVariants.success)
      handleClose()
    }
  }

  return (
    <Dialog data-cy="formation-create-edit" handleClose={handleClose} open>
      <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Title title={!formation ? messages.creationTitle : messages.editionTitle} />
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
              defaultValue={formation?.title || ''}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <Input
                  name={fields.title}
                  onChange={onChange}
                  placeholder="Titre de la formation"
                  value={value}
                  autoFocus
                />
              )}
            />
            <FormError errors={errorMessages} field={fields.title} />
          </Box>
          <Box>
            <UIInputLabel>Description</UIInputLabel>
            <Controller
              name={fields.description}
              control={control}
              defaultValue={formation?.description || ''}
              render={({ field: { onChange, value } }) => (
                <Input name={fields.description} onChange={onChange} value={value} multiline maxRows={4} />
              )}
            />
          </Box>
          <Box>
            <UIInputLabel required>Type de contenu</UIInputLabel>
            <Controller
              name={fields.contentType}
              control={control}
              defaultValue={formation?.content_type || 'link'}
              rules={{ required: true }}
              render={({ field }) => (
                <RadioGroup row name={fields.contentType} {...field}>
                  <FormControlLabel value="link" control={<Radio />} label="Lien" />
                  <FormControlLabel value="file" control={<Radio />} label="Fichier" />
                </RadioGroup>
              )}
            />
          </Box>
          {contentType === 'link' && (
            <Box>
              <UIInputLabel>Lien</UIInputLabel>
              <Controller
                name={fields.link}
                control={control}
                defaultValue={formation?.link || ''}
                render={({ field: { onChange, value } }) => (
                  <Input
                    name={fields.link}
                    onChange={onChange}
                    placeholder="https://parti-renaissance.fr"
                    value={value}
                  />
                )}
              />
            </Box>
          )}
          {contentType === 'file' && (
            <Box>
              <FilePond
                files={files}
                onupdatefiles={setFiles}
                allowProcess={false}
                labelIdle='Glissez-déposez votre fichier ou <span class="filepond--label-action">parcourir</span>'
              />
            </Box>
          )}
          <Box>
            <UIInputLabel required>Zone</UIInputLabel>
            <Controller
              name={fields.zone}
              control={control}
              defaultValue={zone}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <UISelect
                  options={currentScope.zones.map(z => ({ key: z.uuid, value: `${z.name} (${z.code})` }))}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
            <FormError errors={errorMessages} field={fields.zone} />
          </Box>
          <Box>
            <UIInputLabel>Position</UIInputLabel>
            <Controller
              name={fields.position}
              control={control}
              defaultValue={position}
              render={({ field: { onChange, value } }) => (
                <Input name={fields.position} onChange={onChange} value={value} />
              )}
            />
          </Box>
          <Box>
            <Controller
              name={fields.published}
              control={control}
              defaultValue={formation?.published || false}
              render={({ field: { onChange, value } }) => (
                <FormControlLabel
                  name={fields.published}
                  label="Publiée"
                  onChange={onChange}
                  control={<Checkbox checked={value} />}
                />
              )}
            />
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
            {!formation ? messages.create : messages.update}
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
  formation: PropTypes.object,
  handleClose: PropTypes.func,
  onCreateResolve: PropTypes.func,
  onUpdateResolve: PropTypes.func,
}
