/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types'
import { Box, FormControlLabel, Grid, IconButton, TextField as MuiTextField, Typography } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { styled } from '@mui/system'
import Stepper from 'ui/Stepper/Stepper'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Checkbox } from 'ui/Checkbox/Checkbox'
import { FormError } from 'components/shared/error/components'
import Select from 'ui/Select/Select'
import { useMutation, useQuery } from 'react-query'
import {
  createEvent as createEventApi,
  updateEvent as updateEventApi,
  uploadImage as imageUploadApi,
  deleteImage as deleteImageApi,
  getCategories,
} from 'api/events'
import Places from 'ui/Places/Places'
import timezones from './timezones.json'
import Submit from 'ui/Stepper/Submit'
import Label from 'ui/Stepper/Label'
import { notifyVariants } from 'components/shared/notification/constants'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { useErrorHandler } from 'components/shared/error/hooks'
import { Event } from 'domain/event'
import DateTimePicker from 'ui/DateTime/DateTimePicker'
import Input from 'ui/Input/Input'
import ImageUploader from './Images/ImageUploader'
import { ONE_DAY } from './constants'
import { useCurrentDeviceType } from 'components/shared/device/hooks'
import Dialog from 'ui/Dialog'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import isBase64 from 'is-base64'

const Title = styled(Typography)`
  font-size: 24px;
  font-weight: 400;
  line-height: 24px;
`

const TextArea = styled(MuiTextField)(
  ({ theme }) => `
  border-radius: 8px;
  border: none;
  color: ${theme.palette.blackCorner};
  background-color: ${theme.palette.gray100};
`
)

const eventSchema = Yup.object({
  description: Yup.string().min(10, 'Minimum 1 caractère').required('Description obligatoire'),
})

const fields = {
  name: 'name',
  category: 'categoryId',
  beginAt: 'beginAt',
  finishAt: 'finishAt',
  timezone: 'timezone',
  address: 'address',
  visio: 'visioUrl',
  capacity: 'capacity',
  description: 'description',
  private: 'private',
}

const messages = {
  create: 'Créer un évènement',
  edit: "Modifier l'évènement",
  createSuccess: "L'évènement a été créé",
  editSuccess: "L'évènement a été modifié",
  step1: 'Informations générales',
  step2: 'Informations détaillées',
  label: {
    name: "Nom de l'évènement",
    category: 'Type',
    beginAt: 'Date et heure de début',
    finishAt: 'Date et heure de fin',
    address: 'Adresse',
    timezone: 'Fuseau horaire',
    image: 'Ajoutez une image à votre évènement',
    description: 'À propos',
    visio: 'Lien de la visio ou du live',
    capacity: 'Capacité',
    private: 'Cet évènement est réservé aux adhérents',
  },
  placeholder: {
    name: "Nom de l'évènement",
    category: "Type de l'évènement",
    beginAt: '__  /__  /____    __:__',
    finishAt: '__  /__  /____    __:__',
    address: "Entrez l'adresse de l'évènement",
    locality: 'Ville',
    postalCode: 'CP',
    country: 'Pays',
    description: 'Entrez un paragraphe afin de décrire cet évènement',
    visio: "Entrez le lien de la vision de l'évènement",
    capacity: 'Quel est le nombre maximal de participants à cet évènement ?',
  },
}

const noOp = () => () => {}

const CreateEditEvent = ({ handleClose, event, onUpdate }) => {
  const isCreateMode = !event.id
  const [newEvent, setNewEvent] = useState(event)
  const [resetActiveStep, setResetActiveStep] = useState(noOp)
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError, errorMessages } = useErrorHandler()
  const setResetActiveStepRef = useCallback(f => setResetActiveStep(() => f), [])
  const [image, setImage] = useState(event.image || undefined)
  const { isMobile } = useCurrentDeviceType()

  const onError = useCallback(
    error => {
      handleError(error)
      resetActiveStep()
    },
    [handleError, resetActiveStep]
  )

  const { mutateAsync: uploadImage } = useMutation(imageUploadApi, { onError })
  const { mutate: deleteImage, isLoading: isDeleting } = useMutation(() => deleteImageApi(newEvent.id), {
    onSuccess: () => setImage(undefined),
    onError,
  })

  const handleImageDelete = () => {
    if (image && newEvent.image) return deleteImage()
    return setImage(undefined)
  }

  const { mutate: createEvent, isLoading: isCreating } = useMutation(createEventApi, {
    onSuccess: async newUuid => {
      image && isBase64(image, { allowMime: true }) && (await uploadImage({ eventId: newUuid, image }))
      await onUpdate()
      enqueueSnackbar(messages.createSuccess, notifyVariants.success)
      handleClose()
    },
    onError,
  })

  const { mutate: updateEvent, isLoading: isUpdating } = useMutation(updateEventApi, {
    onSuccess: async uuid => {
      image && isBase64(image, { allowMime: true }) && (await uploadImage({ eventId: uuid, image }))
      await onUpdate()
      enqueueSnackbar(messages.editSuccess, notifyVariants.success)
      handleClose()
    },
    onError,
  })

  const { data: categoriesByGroup = null } = useQuery(
    ['categories', { feature: 'Events', view: 'Events' }],
    getCategories,
    {
      cacheTime: ONE_DAY,
      staleTime: ONE_DAY,
    }
  )

  const categories = useMemo(
    () =>
      (
        categoriesByGroup?.map(group =>
          [{ key: group.slug, value: group.name, group: true }].concat(
            group.categories.map(c => ({
              key: c.slug,
              value: c.name,
            }))
          )
        ) || []
      ).flatMap(_ => _),
    [categoriesByGroup]
  )

  const { control, formState, getValues, reset, watch } = useForm({
    mode: 'onChange',
    resolver: yupResolver(eventSchema),
  })
  const watchAllFields = watch()
  const values = getValues()
  const isStepOneValid =
    !!values.name &&
    !!values.categoryId &&
    !!values.beginAt &&
    !!values.finishAt &&
    !!values.address?.route &&
    !!values.timezone
  const isStepTwoValid = formState.isValid
  const areAllStepsValid = [isStepOneValid && 0, isStepTwoValid && 1].filter(s => Boolean(s) || s === 0)

  const prepareCreate = () => {
    const { name, categoryId, beginAt, finishAt, timezone, description, visioUrl, capacity, address } = values
    const { attendees } = newEvent

    const eventObj = new Event(
      null,
      name,
      description,
      timezone,
      null,
      beginAt,
      finishAt,
      null,
      null,
      null,
      attendees,
      false,
      capacity,
      address,
      categoryId,
      newEvent.private,
      visioUrl,
      '',
      null
    )
    return eventObj
  }

  const createOrEdit = () => {
    if (!isCreateMode) {
      updateEvent(newEvent)
    } else {
      createEvent(prepareCreate())
    }
  }

  useEffect(() => {
    if (newEvent.id) {
      reset(newEvent)
    }
  }, [newEvent])

  return (
    <Dialog handleClose={handleClose} open data-cy="event-create-edit">
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mt: isMobile ? 2 : null }}>
        <Title>{isCreateMode ? messages.create : messages.edit}</Title>
        <IconButton onClick={handleClose}>
          <CloseRoundedIcon />
        </IconButton>
      </Grid>

      <Grid container sx={{ mb: isMobile ? 2 : null }}>
        <Stepper
          orientation="vertical"
          validSteps={areAllStepsValid}
          sx={{ width: '100%', pt: 4 }}
          resetActiveStep={setResetActiveStepRef}
        >
          <div>
            <div title={messages.step1}>
              <Label sx={{ pt: 3, pb: 1 }}>{messages.label.name}</Label>
              <Controller
                name={fields.name}
                control={control}
                defaultValue={newEvent.name}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    name={fields.name}
                    onChange={onChange}
                    placeholder={messages.placeholder.name}
                    value={value}
                    autoFocus
                  />
                )}
              />
              <FormError errors={errorMessages} field={fields.name} />
              <Label sx={{ pt: 3, pb: 1 }}>{messages.label.category}</Label>
              <Controller
                name={fields.category}
                control={control}
                defaultValue={newEvent.categoryId}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <Select
                    options={categories}
                    onChange={onChange}
                    value={value}
                    placeholder={messages.placeholder.category}
                    sx={{ display: 'flex' }}
                  />
                )}
              />
              <FormError errors={errorMessages} field={fields.category} />
              <Label sx={{ pt: 3, pb: 1 }}>{messages.label.beginAt}</Label>
              <Controller
                name={fields.beginAt}
                control={control}
                defaultValue={newEvent.beginAt}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <DateTimePicker
                    value={value}
                    onChange={onChange}
                    name={fields.beginAt}
                    minDate={new Date()}
                    placeholder={messages.placeholder.beginAt}
                  />
                )}
              />
              <FormError errors={errorMessages} field={fields.beginAt} />
              <Label sx={{ pt: 3, pb: 1 }}>{messages.label.finishAt}</Label>
              <Controller
                name={fields.finishAt}
                control={control}
                defaultValue={newEvent.finishAt}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <DateTimePicker
                    value={value}
                    onChange={onChange}
                    name={fields.finishAt}
                    minDate={new Date()}
                    placeholder={messages.placeholder.finishAt}
                  />
                )}
              />
              <FormError errors={errorMessages} field={fields.finishAt} />
              <Label sx={{ pt: 3, pb: 1 }}>{messages.label.timezone}</Label>
              <Controller
                name={fields.timezone}
                control={control}
                defaultValue={newEvent.timezone}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <Select options={timezones} onChange={onChange} value={value} sx={{ display: 'flex' }} />
                )}
              />
              <FormError errors={errorMessages} field={fields.timezone} />
              <Label sx={{ pt: 3, pb: 1 }}>{messages.label.address}</Label>
              <Controller
                name={fields.address}
                control={control}
                defaultValue={newEvent.address?.route}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <Places initialValue={newEvent.address?.route} onSelectPlace={onChange} />
                )}
              />
              <FormError errors={errorMessages} field={fields.address} />
              <Box component="div" sx={{ display: 'flex', mt: 3 }}>
                <Input
                  placeholder={messages.placeholder.postalCode}
                  value={values.address?.postalCode || newEvent.address?.postalCode || ''}
                  disabled
                  sx={{ flex: 1 }}
                />
                <Input
                  placeholder={messages.placeholder.locality}
                  value={values.address?.locality || newEvent.address?.locality || ''}
                  disabled
                  sx={{ flex: 2, mx: 2 }}
                />
                <Input
                  placeholder={messages.placeholder.country}
                  value={values.address?.country || newEvent.address?.country || ''}
                  disabled
                  sx={{ flex: 1 }}
                />
              </Box>
            </div>
          </div>
          <div>
            <div title={messages.step2}>
              <Label sx={{ pt: 3, pb: 1 }}>{messages.label.image}</Label>
              <ImageUploader
                image={image}
                setImage={setImage}
                handleImageDelete={handleImageDelete}
                isDeleting={isDeleting}
              />
              <Label sx={{ pt: 3, pb: 1 }}>{messages.label.description}</Label>
              <Controller
                name={fields.description}
                control={control}
                defaultValue={newEvent.description}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <TextArea
                    multiline
                    rows={6}
                    fullWidth
                    size="small"
                    name={fields.description}
                    placeholder={messages.placeholder.description}
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
              <FormError errors={errorMessages} field={fields.description} />
              <Label optional sx={{ pt: 3, pb: 1 }}>
                {messages.label.visio}
              </Label>
              <Controller
                name={fields.visio}
                control={control}
                defaultValue={newEvent.visioUrl}
                rules={{ required: false }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    name={fields.visio}
                    placeholder={messages.placeholder.visio}
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
              <FormError errors={errorMessages} field={fields.visio} />
              <Label optional sx={{ pt: 3, pb: 1 }}>
                {messages.label.capacity}
              </Label>
              <Controller
                name={fields.capacity}
                control={control}
                defaultValue={newEvent.capacity}
                rules={{ required: false }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    type="number"
                    min="0"
                    name={fields.capacity}
                    placeholder={messages.placeholder.capacity}
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
              <FormError errors={errorMessages} field={fields.capacity} />
              <FormControlLabel
                name={fields.private}
                label={messages.label.private}
                control={<Checkbox checked={!!newEvent.private} />}
                onChange={(_, value) => setNewEvent(prev => prev.withPrivate(value))}
                sx={{ pt: 2 }}
              />
            </div>
          </div>
        </Stepper>
        <Submit
          label={isCreateMode ? messages.create : messages.edit}
          handleValidate={createOrEdit}
          disabled={areAllStepsValid.length < 2 || isCreating || isUpdating}
          isLoading={isCreating || isUpdating}
        />
      </Grid>
    </Dialog>
  )
}

CreateEditEvent.propTypes = {
  handleClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  event: Event.propTypes,
}

export default CreateEditEvent
