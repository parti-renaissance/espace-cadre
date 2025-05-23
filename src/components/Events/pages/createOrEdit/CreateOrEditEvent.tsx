import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PageHeader from '~/ui/PageHeader'
import { useNavigate, useParams } from 'react-router'
import { addDays, addHours, isSameDay } from 'date-fns'
import { DatePicker, TimePicker } from '@mui/x-date-pickers'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Controller, SubmitHandler, useForm, UseFormRegister } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { messages } from '~/components/Events/shared/constants'
import { debounce } from 'lodash'
import TiptTapEditor from '~/components/Events/Components/Editor'
import {
  Alert,
  Autocomplete,
  Breadcrumbs,
  Button,
  Container,
  FormControlLabel,
  FormHelperText,
  Grid,
  Link,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { objectToSnakeCase } from '~/utils/object'
import {
  createEvent as createEventApi,
  deleteImage as deleteImageApi,
  getEvent,
  updateEvent as updateEventApi,
  uploadImage as imageUploadApi,
} from '~/api/events'
import BlockForm from '~/ui/Form/BlockForm'
import { CreateEventForm, CreateEventSchema, Event, VisibilityEvent } from '~/domain/event'
import Category from '~/components/Events/pages/createOrEdit/components/forms/category'
import Visibility from '~/components/Events/pages/createOrEdit/components/forms/visibility'
import UploadImage from '~/components/Events/pages/createOrEdit/components/forms/uploadImage'
import FormGroup from '~/components/Events/pages/createOrEdit/components/FormGroup/FormGroup'
import { Box } from '@mui/system'

import countries from '~/shared/countries.json'
import { useCustomSnackbar } from '~/components/shared/notification/hooks'
import { useErrorHandler } from '~/components/shared/error/hooks'
import { notifyVariants } from '~/components/shared/notification/constants'
import { useQueryWithScope } from '~/api/useQueryWithScope'
import { useBlocker } from 'react-router-dom'
import ModalBeforeLeave from '../../Components/ModalBeforeLeave'
import TextFieldPlaces from '~/components/Events/pages/createOrEdit/components/TextFieldPlaces'
import { useSelector } from 'react-redux'
import { getCurrentScope } from '~/redux/user/selectors'
import type { Scope } from '~/domain/scope'
import paths from '~/shared/paths'
import { paths as eventPaths } from '~/components/Events/shared/paths'
import { joinDateTime } from '~/utils/date'
import { getTimezoneOffsetLabel } from '~/shared/helpers'

const Form = ({ event, editable }: { event?: Event; editable: boolean }) => {
  const currentScope = useSelector(getCurrentScope) as Scope
  const { enqueueSnackbar } = useCustomSnackbar()
  const navigate = useNavigate()
  const [blockerOpen, setBlockerOpen] = useState(false)
  const queryClient = useQueryClient()
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    getValues,
    reset,
    control,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<CreateEventForm>({
    mode: 'onChange',
    defaultValues: {
      name: event?.name ?? '',
      category: event?.category,
      visibility: (event?.visibility ?? 'public') as VisibilityEvent,
      beginAt: event ? event.localBeginAt : new Date(),
      finishAt: event ? event.localFinishAt : new Date(),
      timeBeginAt: event ? event.localBeginAt : new Date(),
      timeFinishAt: event ? event.localFinishAt : addHours(new Date(), 1),
      timeZone: event?.timeZone ?? 'Europe/Paris',
      description: {
        pure: event ? '12345678910' : '',
        json: event?.json_description ?? '',
        html: event?.description ?? '',
      },
      visioUrl: event?.visioUrl ?? '',
      isVirtual: event ? event?.mode === 'online' : false,
      capacity: event?.capacity,
      severalDays: event ? !isSameDay(event.localBeginAt, event.localFinishAt) : false,
      address: {
        address: event?.address?.address ?? '',
        postalCode: event?.address?.postalCode ?? '',
        cityName: event?.address?.cityName ?? '',
        country: event?.address?.country ?? '',
      },
      liveUrl: event?.liveUrl ?? '',
    },
    resolver: zodResolver(CreateEventSchema),
  })

  const muiRegister = (...[name]: Parameters<UseFormRegister<CreateEventForm>>) => {
    const { ref, ...rest } = register(name)
    return {
      ...rest,
      inputRef: ref,
      InputLabelProps: {
        shrink: !!watch(name),
      },
    }
  }

  const findCountry = useCallback((code: string) => countries.find(country => country.code === code), [])

  const blocker = useBlocker(({ nextLocation }) => {
    if (
      isDirty &&
      !nextLocation.pathname.startsWith(`${paths.events}/${editable ? eventPaths.update : eventPaths.create}`)
    ) {
      setBlockerOpen(true)
      return true
    }
    return false
  })

  const handleCloseBlockerModal = () => {
    setBlockerOpen(false)
  }

  const [image, setImage] = React.useState<string | undefined>(undefined)

  const timezones = useMemo(
    () =>
      Intl.supportedValuesOf('timeZone').map(timeZone => ({
        key: timeZone,
        value: `${timeZone} (${getTimezoneOffsetLabel(timeZone)})`,
      })),
    []
  )

  useEffect(() => {
    if (event?.image) {
      setImage(event.image)
    }
  }, [event])

  const { handleError } = useErrorHandler()

  const { mutateAsync: uploadImage } = useMutation(imageUploadApi, {
    onError: error => {
      handleError(error ?? "Une erreur est survenue lors de l'envoi de l'image")
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

      reset(getValues())
      queryClient.invalidateQueries(['event', uuid])

      setTimeout(() => {
        navigate(`${paths.events}/${uuid}`)
      })
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

  const onSubmit: SubmitHandler<CreateEventForm> = data => {
    const {
      beginAt,
      finishAt,
      timeBeginAt,
      description,
      timeFinishAt,
      category,
      isVirtual,
      severalDays,
      address,
      ...rest
    } = data

    const convertFinishAt = new Date(finishAt ? finishAt : beginAt)

    const committee =
      Array.isArray(currentScope.getCommittees()) && currentScope.getCommittees().length
        ? currentScope.getCommittees()[0].uuid
        : null

    const payload = {
      ...objectToSnakeCase(rest),
      description: description?.html ?? '',
      json_description: description?.json ?? '',
      id: event?.id,
      begin_at: joinDateTime(beginAt, timeBeginAt),
      finish_at: joinDateTime(severalDays ? convertFinishAt : beginAt, timeFinishAt),
      mode: isVirtual ? 'online' : 'meeting',
      capacity: data.capacity ? parseInt(data.capacity, 10) : undefined,
      post_address: !isVirtual ? objectToSnakeCase(address) : undefined,
      visio_url: isVirtual ? data.visioUrl : undefined,
      category: category.slug,
      ...(committee ? { type: 'committee', committee } : {}),
    }

    return mutation({ event: payload })
  }
  const debouncedOnSubmit = React.useRef(debounce(onSubmit, 1000))

  const category = watch('category')

  return (
    <form onSubmit={handleSubmit(debouncedOnSubmit.current)}>
      <Stack mt={4} spacing={5}>
        <BlockForm title="Un événement pour qui ?">
          <FormGroup label="Catégorie">
            <Category
              category={category}
              onClick={(_, newCategory) => setValue('category', newCategory, { shouldDirty: true })}
              register={register}
            />

            {errors.category && <FormHelperText sx={{ color: 'red' }}>{errors.category.message}</FormHelperText>}
          </FormGroup>

          <FormGroup label="Visibilité">
            {category && category.alert && (
              <Alert severity="warning" sx={{ mb: 1 }}>
                {category.alert}
              </Alert>
            )}

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
              {...muiRegister('name')}
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
              control={
                <Switch
                  onChange={x => {
                    setValue('severalDays', x.target.checked)
                    if (!x.target.checked) {
                      setValue('finishAt', getValues('beginAt'))
                    } else {
                      setValue('finishAt', addDays(getValues('beginAt'), 1))
                    }
                  }}
                  color="primary"
                  checked={watch('severalDays')}
                />
              }
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
                  <Controller
                    name="beginAt"
                    control={control}
                    defaultValue={new Date()}
                    render={({ field: { onChange, value } }) => (
                      <DatePicker
                        label={watch('severalDays') ? 'Date de début' : 'Date'}
                        value={value}
                        onChange={newValue => onChange(newValue)}
                        minDate={new Date()}
                      />
                    )}
                  />
                  <FormHelperText sx={{ color: 'red' }}>{errors?.beginAt?.message}</FormHelperText>
                </Grid>

                <Grid item xs={12} sm={6}>
                  {watch('severalDays') && (
                    <DatePicker
                      label="Date de fin"
                      slots={{ textField: TextField }}
                      value={watch('finishAt')}
                      disabled={!watch('severalDays') || !watch('beginAt')}
                      minDate={addDays(watch('beginAt'), 1)}
                      maxDate={addDays(new Date(watch('beginAt')), 3)}
                      onChange={value => {
                        setValue('finishAt', value as Date)
                      }}
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
                    {...register('timeFinishAt')}
                    label="Heure de fin"
                    value={watch('timeFinishAt')}
                    onChange={value => {
                      if (value === null) {
                        return
                      }

                      setValue('timeFinishAt', new Date(value as Date))
                    }}
                    minTime={watch('timeBeginAt')}
                    disabled={watch('timeBeginAt') === undefined}
                    sx={{ width: '100%' }}
                  />
                </Grid>
              </Grid>

              <Box>
                {[errors.finishAt, errors.timeBeginAt, errors.timeFinishAt, errors.timeZone].map((error, index) => (
                  <FormHelperText sx={{ color: 'red' }} key={index}>
                    {error?.message}
                  </FormHelperText>
                ))}
              </Box>

              <Box mt={2}>
                <Autocomplete
                  id="timezones"
                  {...register('timeZone')}
                  {...(editable && {
                    value: timezones?.find(option => option?.key === event?.timeZone)?.value,
                  })}
                  onChange={(_, value) => {
                    setValue('timeZone', timezones.find(option => option.value === value)?.key ?? 'Europe/Paris')
                  }}
                  defaultValue={timezones.find(option => option.key === 'Europe/Paris')?.value}
                  options={timezones.map(option => option.value)}
                  sx={{ width: '100%' }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      InputLabelProps={{
                        shrink: !!watch('timeZone'),
                      }}
                      label="Fuseau horaire"
                    />
                  )}
                />
              </Box>
            </Stack>
          </FormGroup>

          <FormGroup label="À propos">
            <Controller
              name="description"
              control={control}
              render={({ field: { onChange, value, onBlur }, fieldState }) => (
                <Stack>
                  {/* @ts-expect-error wegwerg */}
                  <TiptTapEditor onChange={onChange} value={value!} onBlur={onBlur} />
                  <Box>
                    {fieldState.error?.message ? (
                      <FormHelperText sx={{ color: 'red' }}>{fieldState.error.message}</FormHelperText>
                    ) : null}
                  </Box>
                </Stack>
              )}
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
                {...muiRegister('visioUrl')}
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
                      value={value}
                      onSelectPlace={(place: any) => {
                        setValue('address.address', place.getAddress())
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
                    {...muiRegister('address.postalCode')}
                    label="Code postal"
                    variant="outlined"
                    fullWidth
                    error={!!errors?.address?.postalCode}
                    helperText={errors?.address?.postalCode?.message}
                  />

                  <TextField
                    {...muiRegister('address.cityName')}
                    label="Ville"
                    variant="outlined"
                    fullWidth
                    error={!!errors?.address?.cityName}
                    helperText={errors?.address?.cityName?.message}
                  />
                  <Controller
                    render={({ field: { onChange, value, ref } }) => (
                      <Autocomplete
                        id="countries"
                        value={value ? findCountry(value) : null}
                        onChange={(_, newValue) => {
                          onChange(newValue?.code)
                        }}
                        ref={ref}
                        getOptionLabel={option => option.label}
                        options={countries}
                        getOptionKey={option => option.code}
                        sx={{ width: '100%' }}
                        renderInput={params => <TextField {...params} label="Pays" />}
                      />
                    )}
                    name="address.country"
                    control={control}
                  />
                </Stack>

                {errors.address?.root && (
                  <Stack mt={2}>
                    <Alert severity="error">{errors.address.root.message}</Alert>
                  </Stack>
                )}
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

        <LoadingButton
          type="submit"
          variant="contained"
          disabled={isSubmitting || isLoading || !isValid}
          color="primary"
          loading={isLoading}
        >
          {editable ? 'Modifier' : 'Créer'}
        </LoadingButton>
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
