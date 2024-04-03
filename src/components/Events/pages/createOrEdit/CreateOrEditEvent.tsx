import React, { useCallback, useEffect, useState } from 'react'
import PageHeader from '~/ui/PageHeader'
import { useNavigate, useParams } from 'react-router'
import { addDays } from 'date-fns'
import { DatePicker, TimePicker } from '@mui/x-date-pickers'
import { useMutation } from '@tanstack/react-query'
import { SubmitHandler, useForm, Controller, Control } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { messages } from '~/components/Events/shared/constants'
import {
  Stack,
  Breadcrumbs,
  Container,
  Grid,
  Link,
  Typography,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  FormHelperText,
  Autocomplete,
} from '@mui/material'
import {
  createEvent as createEventApi,
  deleteImage as deleteImageApi,
  getEvent,
  updateEvent as updateEventApi,
  uploadImage as imageUploadApi,
} from '~/api/events'
import BlockForm from '~/components/Events/pages/createOrEdit/components/BlockForm/BlockForm'
import { CreateEventForm, CreateEventSchema, Event, VisibilityEvent } from '~/domain/event'
import Category from '~/components/Events/pages/createOrEdit/components/forms/category'
import Visibility from '~/components/Events/pages/createOrEdit/components/forms/visibility'
import UploadImage from '~/components/Events/pages/createOrEdit/components/forms/uploadImage'
import FormGroup from '~/components/Events/pages/createOrEdit/components/FormGroup/FormGroup'
import { Box } from '@mui/system'

import timezones from '~/shared/timezones.json'
import countries from '~/shared/countries.json'
import { useCustomSnackbar } from '~/components/shared/notification/hooks'
import { useErrorHandler } from '~/components/shared/error/hooks'
import { notifyVariants } from '~/components/shared/notification/constants'
import { useQueryWithScope } from '~/api/useQueryWithScope'
import { useBlocker } from 'react-router-dom'
import ModalBeforeLeave from '../../Components/ModalBeforeLeave'
import { formatDateTimeWithTimezone } from '~/components/Events/shared/helpers'
import TextFieldPlaces from '~/components/Events/pages/createOrEdit/components/TextFieldPlaces'
import { useSelector } from 'react-redux'
import { getCurrentScope } from '~/redux/user/selectors'
import type { Scope } from '~/domain/scope'
import paths from '~/shared/paths'
import { paths as eventPaths } from '~/components/Events/shared/paths'

type FormInputTextProps = {
  label: string
  name: string
  control: Control
  textFieldProps?: React.ComponentProps<typeof TextField>
}

const FormInputText = ({ label, name, control, textFieldProps }: FormInputTextProps) => (
  <Controller
    render={({ field }) => <TextField {...textFieldProps} {...field} inputRef={field.ref} />}
    name="name"
    control={control}
  />
)

const Form = ({ event, editable }: { event?: Event; editable: boolean }) => {
  const currentScope = useSelector(getCurrentScope) as Scope
  const { enqueueSnackbar } = useCustomSnackbar()
  const navigate = useNavigate()
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    getValues,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CreateEventForm>({
    defaultValues: {
      timezone: 'Europe/Paris',
      capacity: '',
      ...(editable &&
        event && {
          name: event?.name,
          categoryId: event?.category.slug,
          visibility: event?.visibility as VisibilityEvent,
          beginAt: new Date(event?.beginAt),
          finishAt: new Date(event?.finishAt),
          timeBeginAt: new Date(event?.beginAt),
          timeFinishAt: new Date(event?.finishAt),
          timezone: event?.timezone,
          description: event?.description,
          visioUrl: event?.visioUrl || '',
          isVirtual: event?.mode === 'online',
          capacity: event?.capacity,
          severalDays: event?.beginAt !== event?.finishAt,
          address: {
            address: event?.address?.address || '',
            postalCode: event?.address?.postalCode || '',
            cityName: event?.address?.cityName || '',
            country: event?.address?.country || '',
          },
          liveUrl: event?.liveUrl || '',
        }),
    },
    mode: 'all',
    resolver: zodResolver(CreateEventSchema),
  })

  const blocker = useBlocker(({ nextLocation }) => {
    if (
      isDirty &&
      isSubmitting &&
      !nextLocation.pathname.startsWith(`${paths.events}/${editable ? eventPaths.update : eventPaths.create}`)
    ) {
      setBlockerOpen(true)
      return true
    }
    return false
  })

  const [blockerOpen, setBlockerOpen] = useState(false)

  const handleCloseBlockerModal = () => {
    setBlockerOpen(false)
  }

  const [image, setImage] = React.useState<string | undefined>(undefined)

  useEffect(() => {
    if (event?.image) {
      setImage(event.image)
    }
  }, [event])

  const { handleError } = useErrorHandler()

  const { mutateAsync: uploadImage } = useMutation(imageUploadApi, {
    onError: error => {
      handleError(error || "Une erreur est survenue lors de l'envoi de l'image")
    },
  })

  const { mutate: mutation, isLoading } = useMutation(editable ? updateEventApi : createEventApi, {
    onSuccess: async uuid => {
      const image = watch('image')

      image && !image.startsWith('http') && (await uploadImage({ eventId: uuid, image }))

      enqueueSnackbar(
        editable ? 'Votre événement a été modifié avec succès' : 'Votre événement a été créé avec succès',
        notifyVariants.success
      )

      navigate(`${paths.events}/${uuid}`)
    },
    onError: ({
      response: { data },
    }: {
      response: {
        data: {
          violations: {
            message: string
          }[]
        }
      }
    }) => {
      if (!data?.violations) {
        enqueueSnackbar("Une erreur s'est produite", notifyVariants.error)
      }

      data?.violations?.map(violation => {
        enqueueSnackbar(violation.message, notifyVariants.error)
      })
    },
  })

  const { mutate: deleteImage } = useMutation(() => deleteImageApi(event?.id), {
    onSuccess: () => {
      setImage(undefined)

      enqueueSnackbar('Image supprimée avec succès', notifyVariants.success)
    },
    onError: handleError,
  })

  const handleImageDelete = () => {
    setImage(undefined)
    deleteImage()
  }

  const onSubmit: SubmitHandler<CreateEventForm> = () => {
    const { beginAt, finishAt, timeBeginAt, timeFinishAt } = getValues()

    const convertFinishAt = new Date(finishAt ? finishAt : beginAt)

    const committee =
      Array.isArray(currentScope.getCommittees()) && currentScope.getCommittees().length
        ? currentScope.getCommittees()[0].uuid
        : null

    const data = {
      id: event?.id,
      name: getValues('name'),
      category: getValues('categoryId'),
      visibility: getValues('visibility'),
      begin_at: formatDateTimeWithTimezone(beginAt, timeBeginAt),
      finish_at: formatDateTimeWithTimezone(watch('severalDays') ? convertFinishAt : beginAt, timeFinishAt),
      time_zone: getValues('timezone'),
      description: getValues('description'),
      visio_url: getValues('visioUrl'),
      live_url: getValues('liveUrl'),
      mode: watch('isVirtual') ? 'online' : 'meeting',
      capacity: parseInt(getValues('capacity') as string),
      post_address: {
        address: getValues('address.address') || null,
        postal_code: getValues('address.postalCode') || null,
        city_name: getValues('address.cityName') || null,
        country: getValues('address.country') || null,
      },
      ...(committee ? { type: 'committee', committee } : {}),
    }

    mutation({ event: data })
  }

  const ContriesField = useCallback(() => {
    const [inputValue, setInputValue] = React.useState('')
    return (
      <Controller
        render={({ field: { onChange, value, ref } }) => (
          <Autocomplete
            id="countries"
            value={value ?? 'FR'}
            onChange={(_, newValue) => {
              onChange(newValue)
            }}
            onInputChange={(_, newInputValue) => {
              setInputValue(newInputValue)
            }}
            inputValue={inputValue}
            ref={ref}
            getOptionLabel={option => countries.find(country => country.code === option)?.label || ''}
            options={countries.map(option => option.code)}
            getOptionKey={option => option}
            defaultValue="FR"
            sx={{ width: '100%' }}
            renderInput={params => <TextField {...params} label="Pays" />}
          />
        )}
        name="address.country"
        control={control}
      />
    )
  }, [control])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack mt={4} spacing={5}>
        <BlockForm title="Un événement pour qui ?">
          <FormGroup label="Catégorie">
            <Category
              category={watch('categoryId')}
              onClick={(_, category) => {
                setValue('categoryId', category, { shouldDirty: true })
              }}
              register={register}
            />

            {errors.categoryId && <FormHelperText sx={{ color: 'red' }}>{errors.categoryId.message}</FormHelperText>}
          </FormGroup>

          <FormGroup label="Visibilité">
            <Visibility
              visibility={watch('visibility')}
              onClick={(_, visibility) => setValue('visibility', visibility)}
              register={register}
            />

            {errors.visibility && <FormHelperText sx={{ color: 'red' }}>{errors.visibility.message}</FormHelperText>}
          </FormGroup>
        </BlockForm>

        <BlockForm title="Informations de l'événement">
          <FormGroup>
            <TextField
              {...register('name')}
              label="Titre de l'événement"
              variant="outlined"
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message}
              InputLabelProps={{
                shrink: !!watch('name'),
              }}
            />
          </FormGroup>

          <FormGroup label="Date et heure">
            <FormControlLabel
              key={'severalDays'}
              control={<Switch {...register('severalDays')} color="primary" checked={watch('severalDays')} />}
              label={'Sur plusieurs journées'}
              sx={{
                '& .MuiFormControlLabel-label': {
                  fontSize: 16,
                },
              }}
            />

            <Stack direction="column" spacing={2} mt={2} width={'100%'}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label={watch('severalDays') ? 'Date de début' : 'Date'}
                    slots={{ textField: TextField }}
                    value={watch('beginAt')}
                    minDate={new Date()}
                    onChange={value => {
                      setValue('beginAt', value as Date)
                    }}
                    sx={{ width: '100%' }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  {watch('severalDays') && (
                    <DatePicker
                      label="Date de fin"
                      slots={{ textField: TextField }}
                      value={watch('finishAt')}
                      disabled={!watch('severalDays') || !watch('beginAt')}
                      minDate={watch('beginAt')}
                      maxDate={addDays(new Date(watch('beginAt')), 3)}
                      onChange={value => setValue('finishAt', value as Date)}
                      sx={{ width: '100%' }}
                    />
                  )}
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TimePicker
                    label="Heure de début"
                    {...register('timeBeginAt')}
                    value={watch('timeBeginAt')}
                    onChange={value => {
                      if (value === null) {
                        return
                      }
                      setValue('timeBeginAt', new Date(value))
                    }}
                    sx={{ width: '100%' }}
                    disabled={watch('beginAt') === undefined}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TimePicker
                    label="Heure de fin"
                    onChange={value => {
                      if (value === null) {
                        return
                      }

                      setValue('timeFinishAt', new Date(value as Date))
                    }}
                    {...(editable && {
                      value: watch('timeFinishAt'),
                    })}
                    minTime={watch('severalDays') ? '00:00' : watch('timeBeginAt')}
                    disabled={watch('timeBeginAt') === undefined}
                    sx={{ width: '100%' }}
                  />
                </Grid>
              </Grid>

              <Box>
                {[errors.beginAt, errors.finishAt, errors.timeBeginAt, errors.timeFinishAt, errors.timezone].map(
                  (error, index) => (
                    <FormHelperText sx={{ color: 'red' }} key={index}>
                      {error?.message}
                    </FormHelperText>
                  )
                )}
              </Box>

              <Box mt={2}>
                <Autocomplete
                  id="timezones"
                  {...register('timezone')}
                  {...(editable && {
                    value: timezones?.find(option => option?.key === event?.timezone)?.value,
                  })}
                  onChange={(_, value) => {
                    setValue('timezone', timezones.find(option => option.value === value)?.key || 'Europe/Paris')
                  }}
                  defaultValue={timezones.find(option => option.key === 'Europe/Paris')?.value}
                  options={timezones.map(option => option.value)}
                  sx={{ width: '100%' }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      InputLabelProps={{
                        shrink: !!watch('timezone'),
                      }}
                      label="Fuseau horaire"
                    />
                  )}
                />
              </Box>
            </Stack>
          </FormGroup>

          <FormGroup label="À propos">
            <TextField
              {...register('description')}
              {...(editable && {
                InputLabelProps: {
                  shrink: true,
                },
              })}
              label="Décrivez ici votre événement"
              variant="outlined"
              fullWidth
              error={!!errors.description}
              helperText={errors.description?.message}
              multiline
              rows={4}
            />
          </FormGroup>

          <FormGroup label="Lieu">
            <Stack mb={3} direction="row" spacing={2}>
              <FormControlLabel
                key={'isVirtual'}
                control={<Switch {...register('isVirtual')} checked={watch('isVirtual')} color="primary" />}
                label={'Visioconférence'}
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontSize: 16,
                  },
                }}
              />
            </Stack>

            {watch('isVirtual') && (
              <TextField
                {...register('visioUrl')}
                {...(editable &&
                  watch('visioUrl') && {
                    value: watch('visioUrl'),
                  })}
                InputLabelProps={{
                  shrink: !!watch('visioUrl'),
                }}
                label="Lien de la visioconférence"
                variant="outlined"
                fullWidth
                error={!!errors.visioUrl}
                helperText={errors.visioUrl?.message}
              />
            )}

            {!watch('isVirtual') && (
              <>
                <Controller
                  control={control}
                  name="address.address"
                  render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                    <TextFieldPlaces
                      ref={ref}
                      onChange={onChange}
                      defaultValue={value}
                      value={value}
                      onSelectPlace={(place: any) => {
                        setValue('address.address', `${place?.number} ${place?.route}`)
                        setValue('address.postalCode', place.postalCode)
                        setValue('address.cityName', place.locality)
                        setValue('address.country', place.country)
                      }}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                ></Controller>

                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <TextField
                    {...register('address.postalCode')}
                    InputLabelProps={{
                      shrink: !!watch('address.postalCode'),
                    }}
                    label="Code postal"
                    variant="outlined"
                    fullWidth
                    error={!!errors?.address?.postalCode}
                    helperText={errors?.address?.postalCode?.message}
                  />

                  <TextField
                    {...register('address.cityName')}
                    InputLabelProps={{
                      shrink: !!watch('address.cityName'),
                    }}
                    label="Ville"
                    variant="outlined"
                    fullWidth
                    error={!!errors?.address?.cityName}
                    helperText={errors?.address?.cityName?.message}
                  />
                  <ContriesField />
                </Stack>
              </>
            )}
          </FormGroup>
        </BlockForm>

        <BlockForm title="Informations optionnelles">
          <UploadImage
            onFileChange={file => setValue('image', file)}
            {...(editable
              ? {
                  imageUrl: image,
                  handleDelete: handleImageDelete,
                }
              : {})}
          />

          <FormGroup label="Capacité">
            <TextField
              {...register('capacity')}
              InputLabelProps={{
                shrink: !!watch('capacity'),
              }}
              label="Quel est le nombre maximal de participants à cet événement ?"
              variant="outlined"
              fullWidth
              error={!!errors.capacity}
              helperText={errors.capacity?.message}
            />
          </FormGroup>
          <FormGroup label="Lien de live">
            <TextField
              {...register('liveUrl')}
              InputLabelProps={{
                shrink: !!watch('liveUrl'),
              }}
              label="Vous prévoyez de diffuser l'événement en ligne ? mettez ici votre lien de visioconférence"
              variant="outlined"
              fullWidth
              error={!!errors.liveUrl}
              helperText={errors.liveUrl?.message}
            />
          </FormGroup>

          <Typography variant="body2" color="text.disabled">
            Ce lien est destiné aux diffusions en ligne des événements sur des plateformes publiques comme Youtube,
            Facebook, X, Instagram ou Tik tok.
          </Typography>
        </BlockForm>
      </Stack>

      <Stack direction="row" justifyContent="flex-end" spacing={2} mt={4}>
        <Button variant="contained" onClick={() => window.history.back()}>
          Annuler
        </Button>

        <Button type="submit" variant="contained" disabled={isSubmitting || isLoading} color="primary">
          {editable ? 'Modifier' : 'Créer'}
        </Button>
      </Stack>

      <ModalBeforeLeave open={blockerOpen} onClose={handleCloseBlockerModal} blocker={blocker} />
    </form>
  )
}

const CreateOrEditEvent = () => {
  const { eventId } = useParams()
  const editable = !!eventId

  const { data, isFetched } = useQueryWithScope(['event', eventId], () => getEvent(eventId), {
    enabled: editable,
  })

  const event = data as Event

  return (
    <Container maxWidth={'xl'} sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageHeader title={editable ? messages.update : messages.create} />
      </Grid>

      <Breadcrumbs separator=">" aria-label="breadcrumb">
        <Link underline="hover" color="black" href={paths.events}>
          {messages.title}
        </Link>

        <Typography color="inherit">{editable ? messages.update : messages.create}</Typography>
      </Breadcrumbs>

      {((editable && isFetched) || !editable) && <Form event={event} editable={editable} />}
    </Container>
  )
}

export default CreateOrEditEvent
