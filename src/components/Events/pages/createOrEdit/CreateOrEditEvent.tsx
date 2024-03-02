import PageHeader from '~/ui/PageHeader'
import { useNavigate, useParams } from 'react-router'
import { addDays, format } from 'date-fns'
import { DatePicker, TimePicker } from '@mui/x-date-pickers'
import { useMutation } from '@tanstack/react-query'
import { SubmitHandler, useForm } from 'react-hook-form'
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
  updateEvent,
  uploadImage as imageUploadApi,
} from '~/api/events'
import BlockForm from '~/components/Events/pages/createOrEdit/components/BlockForm/BlockForm'
import { CreateEventForm, CreateEventSchema, Event, VisibilityEvent } from '~/domain/event'
import Category from '~/components/Events/pages/createOrEdit/components/forms/category'
import Visibility from '~/components/Events/pages/createOrEdit/components/forms/visibility'
import UploadImage from '~/components/Events/pages/createOrEdit/components/forms/uploadImage'
import FormGroup from '~/components/Events/pages/createOrEdit/components/FormGroup/FormGroup'
import { Box } from '@mui/system'

import timezones from '~/components/Events/timezones.json'
import { useCustomSnackbar } from '~/components/shared/notification/hooks'
import { useErrorHandler } from '~/components/shared/error/hooks'
import { notifyVariants } from '~/components/shared/notification/constants'
import { useQueryWithScope } from '~/api/useQueryWithScope'
import React from 'react'

interface CreateOrEditEventProps {
  editable: boolean
}

const CreateOrEditEvent = (props: CreateOrEditEventProps) => {
  const { editable } = props

  const { eventId } = useParams()

  const navigate = useNavigate()
  const { enqueueSnackbar } = useCustomSnackbar()

  const [image, setImage] = React.useState<string | undefined>()

  const { isLoading, data: event } = useQueryWithScope(['event', eventId], (): Promise<Event> => getEvent(eventId), {
    onSuccess: (data: any) => {
      // setImage(data.image)
    },
    enabled: !!editable && !!eventId,
  })

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<CreateEventForm>({
    ...(editable && {
      values: {
        name: event?.name,
        categoryId: event?.categoryId,
        visibilityId: VisibilityEvent.PUBLIC,
        beginAt: new Date(event?.beginAt),
        finishAt: new Date(event?.finishAt),
        timeBeginAt: new Date(event?.beginAt),
        timeFinishAt: new Date(event?.finishAt),
        timezone: event?.timezone,
        description: event?.description,
        visioUrl: event?.visioUrl || '',
        isVirtual: event?.visioUrl,
        capacity: event?.capacity || 1,
        severalDays: event?.beginAt !== event?.finishAt,
        address: event?.address?.route || '',
        zipCode: event?.address?.postalCode || '',
        city: event?.address?.locality || '',
        country: event?.address?.country || '',
        liveUrl: event?.liveUrl,
      },
    }),
    defaultValues: {
      timezone: 'Europe/Paris',
      capacity: 1,
    },
    mode: 'all',
    resolver: zodResolver(CreateEventSchema),
  })
  const { handleError } = useErrorHandler()

  const { mutateAsync: uploadImage } = useMutation(imageUploadApi, {
    onError: error => {
      handleError(error || "Une erreur est survenue lors de l'envoi de l'image")
    },
  })

  const { mutate: mutation } = useMutation(editable ? updateEvent : createEventApi, {
    onSuccess: async uuid => {
      const image = watch('image')

      image && !image.startsWith('http') && (await uploadImage({ eventId: uuid, image }))

      enqueueSnackbar(
        editable ? 'Votre événement a été modifié avec succès' : 'Votre événement a été créé avec succès',
        notifyVariants.success
      )

      navigate(`/evenement/${uuid}`)
    },
    onError: error => {
      // if (error.response?.data?.detail) {
      //   enqueueSnackbar(error.response?.data?.detail, notifyVariants.error)
      // }
      handleError(error)
    },
  })

  const { mutate: deleteImage } = useMutation(() => deleteImageApi(event?.id), {
    onSuccess: () => setImage(undefined),
    onError: handleError,
  })

  const handleImageDelete = () => {
    setImage(undefined)
    deleteImage()
  }

  const onSubmit: SubmitHandler<CreateEventForm> = () => {
    const { beginAt, finishAt, timeBeginAt, timeFinishAt } = getValues()

    const formatDateTime = (date: any | Date, time: any) => {
      const dateISO = format(date, 'yyyy-MM-dd')
      const timeISO = time ? format(time, 'HH:mm:ss') : '00:00:00'

      return `${dateISO} ${timeISO}`
    }

    const data = {
      id: event?.id,
      name: getValues('name'),
      categoryId: getValues('categoryId'),
      visibilityId: getValues('visibilityId'),
      beginAt: formatDateTime(beginAt, timeBeginAt),
      finishAt: watch('severalDays') ? formatDateTime(finishAt, timeFinishAt) : formatDateTime(beginAt, timeFinishAt),
      timezone: getValues('timezone'),
      description: getValues('description'),
      visioUrl: getValues('visioUrl'),
      mode: watch('isVirtual') ? 'online' : 'null',
      capacity: getValues('capacity'),
      post_address: {
        address: getValues('address'),
        postal_code: getValues('zipCode'),
        city_name: getValues('city'),
        country: getValues('country'),
      },
    }

    if (editable) {
      mutation(data)
    } else {
      mutation({
        event: data,
        type: 'public',
      })
    }
  }

  return (
    <Container maxWidth={false} sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageHeader title={messages.create} />
      </Grid>

      <Breadcrumbs separator=">" aria-label="breadcrumb">
        <Link underline="hover" color="black" href="/">
          {messages.title}
        </Link>

        <Typography color="inherit">Créer un événement</Typography>
      </Breadcrumbs>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack mt={4} spacing={5}>
          <BlockForm title="Un événement pour qui ?">
            <FormGroup label="Catégorie">
              <Category
                category={watch('categoryId')}
                onClick={(_, category) => {
                  setValue('categoryId', category)
                }}
                register={register}
              />

              {errors.categoryId && <FormHelperText sx={{ color: 'red' }}>{errors.categoryId.message}</FormHelperText>}
            </FormGroup>

            <FormGroup label="Visibilité">
              <Visibility
                visibility={watch('visibilityId')}
                onClick={(_, visibilityId) => setValue('visibilityId', visibilityId)}
                register={register}
              />

              {errors.visibilityId && (
                <FormHelperText sx={{ color: 'red' }}>{errors.visibilityId.message}</FormHelperText>
              )}
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
                      {...(editable && {
                        value: watch('beginAt'),
                      })}
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
                        {...(editable && {
                          value: watch('finishAt'),
                        })}
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
                      {...(editable && {
                        value: watch('timeBeginAt'),
                      })}
                      value={watch('timeBeginAt')}
                      onChange={value => setValue('timeBeginAt', new Date(value as Date))}
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
                    options={timezones.map(option => option.value)}
                    defaultValue={timezones?.find(option => option?.key === 'Europe/Paris')?.value}
                    sx={{ width: '100%' }}
                    renderInput={params => <TextField {...params} label="Fuseau horaire" />}
                  />
                </Box>
              </Stack>
            </FormGroup>

            <FormGroup label="À propos">
              <TextField
                {...register('description')}
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
                  {...(editable && {
                    value: event?.visioUrl,
                  })}
                  label="Lien de la visioconférence"
                  variant="outlined"
                  fullWidth
                  error={!!errors.visioUrl}
                  helperText={errors.visioUrl?.message}
                />
              )}

              {!watch('isVirtual') && (
                <>
                  <TextField
                    {...register('address')}
                    {...(editable && {
                      value: event?.address?.route,
                    })}
                    label="Adresse"
                    variant="outlined"
                    fullWidth
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />

                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <TextField
                      {...register('zipCode')}
                      {...(editable && {
                        value: event?.address?.postalCode,
                      })}
                      label="Code postal"
                      variant="outlined"
                      fullWidth
                      error={!!errors.zipCode}
                      helperText={errors.zipCode?.message}
                    />

                    <TextField
                      {...register('city')}
                      {...(editable && {
                        value: event?.address?.locality,
                      })}
                      label="Ville"
                      variant="outlined"
                      fullWidth
                      error={!!errors.city}
                      helperText={errors.city?.message}
                    />

                    <TextField
                      {...register('country')}
                      {...(editable && {
                        value: event?.address?.country,
                      })}
                      label="Pays"
                      variant="outlined"
                      fullWidth
                      error={!!errors.country}
                      helperText={errors.country?.message}
                    />
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
                {...register('capacity', {
                  valueAsNumber: true,
                })}
                label="Quel est le nombre maximal de participants à cet événement ?"
                type="number"
                variant="outlined"
                defaultValue={0}
                fullWidth
                error={!!errors.capacity}
                helperText={errors.capacity?.message}
              />
            </FormGroup>
            <FormGroup label="Lieu de live">
              <TextField
                {...register('liveUrl')}
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

          <Button type="submit" variant="contained" disabled={isSubmitting} color="primary">
            Publier
          </Button>
        </Stack>
      </form>
    </Container>
  )
}

export default CreateOrEditEvent
