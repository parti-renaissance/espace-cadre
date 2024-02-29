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
import { createEvent as createEventApi, getEvent, updateEvent, uploadImage as imageUploadApi } from '~/api/events'
import BlockForm from '~/components/Events/pages/create/components/BlockForm/BlockForm'
import { CreateEventForm, CreateEventSchema } from '~/domain/event'
import Category from '~/components/Events/pages/create/components/forms/category'
import Visibility from '~/components/Events/pages/create/components/forms/visibility'
import UploadImage from '~/components/Events/pages/create/components/forms/uploadImage'
import FormGroup from '~/components/Events/pages/create/components/FormGroup/FormGroup'
import { Box } from '@mui/system'

import timezones from '~/components/Events/timezones.json'
import { useCustomSnackbar } from '~/components/shared/notification/hooks'
import { useErrorHandler } from '~/components/shared/error/hooks'
import { notifyVariants } from '~/components/shared/notification/constants'
import { useQueryWithScope } from '~/api/useQueryWithScope'
import React from 'react'

const EditEvent = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useCustomSnackbar()

  const [image, setImage] = React.useState<string | undefined>()

  const { isLoading, data } = useQueryWithScope(['event', eventId], () => getEvent(eventId), {
    onSuccess: (data: any) => {
      setImage(data.image)
    },
  })

  const event = data

  console.log(event)
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<CreateEventForm>({
    values: {
      name: event?.name,
      categoryId: event?.categoryId,
      visibilityId: event?.visibilityId,
      beginAt: new Date(event?.beginAt),
      finishAt: new Date(event?.finishAt),
      timeBeginAt: new Date(event?.beginAt),
      timeFinishAt: new Date(event?.finishAt),
      timezone: event?.timezone,
      description: event?.description,
      visioUrl: event?.visioUrl,
      isVirtual: event?.visioUrl,
      capacity: event?.capacity || 0,
      severalDays: event?.beginAt !== event?.finishAt,
      address: event?.address?.route,
      zipCode: event?.address?.postalCode,
      city: event?.address?.locality,
      country: event?.address?.country,
      liveUrl: event?.liveUrl,
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

  const { mutate: createEvent } = useMutation(updateEvent, {
    onSuccess: async uuid => {
      const image = watch('image')

      image && !image.startsWith('http') && (await uploadImage({ eventId: uuid, image }))

      enqueueSnackbar("L'événement a bien été modifié", notifyVariants.success)

      navigate(`/evenement/${uuid}`)
    },
    onError: error => {
      handleError(error)
    },
  })

  const { mutate: deleteImage, isLoading: isDeleting } = useMutation(() => deleteImageApi(event.id), {
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

    createEvent({
      event: {
        name: getValues('name'),
        categoryId: getValues('categoryId'),
        visibilityId: getValues('visibilityId'),
        beginAt: formatDateTime(beginAt, timeBeginAt),
        finishAt: watch('severalDays') ? formatDateTime(finishAt, timeFinishAt) : formatDateTime(beginAt, timeFinishAt),
        timezone: getValues('timezone'),
        description: getValues('description'),
        visioUrl: getValues('visioUrl'),
        // mode: watch('isVirtual') ? 'online' : 'physical', // TODO: mode
        capacity: getValues('capacity'),
        address: {
          address: getValues('address'),
          postalCode: getValues('zipCode'),
          city: getValues('city'),
          country: getValues('country'),
        },
      },
      type: 'public',
    })
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Container maxWidth={false} sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageHeader title={messages.update} />
      </Grid>

      <Breadcrumbs separator=">" aria-label="breadcrumb">
        <Link underline="hover" color="black" href="/">
          {messages.title}
        </Link>

        <Typography color="inherit">{messages.update}</Typography>
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
                        disabled={!watch('severalDays') || !watch('beginAt')}
                        value={watch('finishAt')}
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
                      value={watch('timeFinishAt')}
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
                    label="Adresse"
                    variant="outlined"
                    fullWidth
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />

                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <TextField
                      {...register('zipCode')}
                      label="Code postal"
                      variant="outlined"
                      fullWidth
                      error={!!errors.zipCode}
                      helperText={errors.zipCode?.message}
                    />

                    <TextField
                      {...register('city')}
                      label="Ville"
                      variant="outlined"
                      fullWidth
                      error={!!errors.city}
                      helperText={errors.city?.message}
                    />

                    <TextField
                      {...register('country')}
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
              imageUrl={event.image}
              onFileChange={file => setValue('image', file)}
              handleDelete={handleImageDelete}
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

          <Button type="submit" variant="contained">
            Publier
          </Button>
        </Stack>
      </form>
    </Container>
  )
}

export default EditEvent
