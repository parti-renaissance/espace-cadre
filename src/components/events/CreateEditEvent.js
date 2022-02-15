import PropTypes from 'prop-types'
import {
  Box,
  Dialog,
  FormControlLabel,
  Grid,
  IconButton,
  Paper as MuiPaper,
  TextField as MuiTextField,
  Typography,
} from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { styled } from '@mui/system'
import Stepper from 'ui/Stepper/Stepper'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Checkbox } from 'ui/Checkbox/Checkbox'
import { FormError } from 'components/shared/error/components'
import Select from 'ui/Select/Select'
import { useMutation, useQueryClient } from 'react-query'
import { createEvent as createEventApi, updateEvent as updateEventApi } from 'api/events'
import Places from 'ui/Places/Places'
import timezones from './timezones.json'
import Submit from 'ui/Stepper/Submit'
import Label from 'ui/Stepper/Label'
import { useDebounce } from 'components/shared/debounce'
import { notifyVariants } from 'components/shared/notification/constants'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { useErrorHandler } from 'components/shared/error/hooks'
import { Event } from 'domain/event'
import DateTimePicker from 'ui/DateTime/DateTimePicker'
import Input from 'ui/Input/Input'

const Title = styled(Typography)`
  font-size: 24px;
  font-weight: 400;
  line-height: 24px;
`

const Paper = styled(MuiPaper)(
  ({ theme }) => `
	padding: ${theme.spacing(4)};
	width: 664px;
	border-radius: 12px;
`
)

const TextArea = styled(MuiTextField)(
  ({ theme }) => `
  border-radius: 8px;
  border: none;
  color: ${theme.palette.blackCorner};
  background-color: ${theme.palette.gray100};
`
)

const fields = {
  name: 'name',
  category: 'category',
  beginAt: 'begin_at',
  finishAt: 'finish_at',
  timezone: 'timezone',
  visio: 'visioUrl',
  capacity: 'capacity',
  description: 'description',
  private: 'private',
  electoral: 'electoral',
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
    description: 'À propos',
    visio: 'Lien de la visio ou du live',
    capacity: 'Capacité',
    private: 'Cet évènement est réservé aux adhérents',
    electoral: 'Cet évènement concerne la campagne présidentielle',
  },
  placeholder: {
    name: "Nom de l'évènement",
    category: "Type de l'évènement",
    beginAt: '__  /__  /____    __:__',
    finishAt: '__  /__  /____    __:__',
    address: "Entrez l'adresse de lévènement",
    locality: 'Ville',
    postalCode: 'CP',
    country: 'Pays',
    description: 'Entrez un paragraphe afin de décrire cet évènement',
    visio: "Entrez le lien de la vision de l'évènement",
    capacity: 'Quel est le nombre maximal de participants à cet évènement ?',
  },
}

const noOp = () => () => {}

const isStep0Valid = ({ name, categoryId, beginAt, finishAt, address, timezone }) =>
  !!name && !!categoryId && !!beginAt && !!finishAt && !!address && !!timezone
const isStep1Valid = ({ description, capacity }) =>
  description.length > 10 && (capacity === '' || capacity === null || parseInt(capacity) > 0)

const CreateEditEvent = ({ handleClose, event, onUpdate }) => {
  const [validSteps, setValidSteps] = useState([])
  const [newEvent, setNewEvent] = useState(event)
  const [resetActiveStep, setResetActiveStep] = useState(noOp)
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError, errorMessages } = useErrorHandler()
  const debounce = useDebounce(500)

  const setResetActiveStepRef = useCallback(f => setResetActiveStep(() => f), [])

  const onError = useCallback(
    error => {
      handleError(error)
      resetActiveStep()
    },
    [handleError, resetActiveStep]
  )

  const { mutate: createEvent } = useMutation(createEventApi, {
    onSuccess: async () => {
      await onUpdate()
      enqueueSnackbar(messages.createSuccess, notifyVariants.success)
      handleClose()
    },
    onError,
  })

  const { mutate: updateEvent } = useMutation(updateEventApi, {
    onSuccess: async () => {
      await onUpdate()
      enqueueSnackbar(messages.editSuccess, notifyVariants.success)
      handleClose()
    },
    onError,
  })

  useEffect(() => {
    debounce(() => {
      const step0Valid = isStep0Valid(newEvent)
      const step1Valid = isStep1Valid(newEvent)
      setValidSteps([step0Valid && 0, step1Valid && 1].filter(s => Boolean(s) || s === 0))
    })
  }, [debounce, newEvent])

  const queryClient = useQueryClient()
  const { data: categoriesByGroup = null } = queryClient.getQueryState([
    'categories',
    { feature: 'Events', view: 'all' },
  ])

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

  const createOrEdit = () => {
    if (newEvent.id) updateEvent(newEvent)
    else createEvent(newEvent)
  }

  return (
    <Dialog scroll="body" data-cy="event-create-edit" onClose={handleClose} PaperComponent={Paper} sx={{ my: 4 }} open>
      <Grid container justifyContent="space-between" alignItems="center">
        <Title>{event?.id ? messages.edit : messages.create}</Title>
        <IconButton onClick={handleClose}>
          <CloseRoundedIcon />
        </IconButton>
      </Grid>

      <Grid container>
        <Stepper
          orientation="vertical"
          validSteps={validSteps}
          sx={{ width: '100%', pt: 4 }}
          resetActiveStep={setResetActiveStepRef}
        >
          <div>
            <div title={messages.step1}>
              <Label sx={{ pt: 3, pb: 1 }}>{messages.label.name}</Label>
              <Input
                name={fields.name}
                placeholder={messages.placeholder.name}
                value={newEvent.name}
                onChange={e => {
                  setNewEvent(prev => prev.withName(e.target.value))
                }}
                autoFocus
              />
              <FormError errors={errorMessages} field={fields.name} />
              <Label sx={{ pt: 3, pb: 1 }}>{messages.label.category}</Label>
              <Select
                options={categories}
                onChange={value => {
                  setNewEvent(prev => prev.withCategory(value))
                }}
                value={newEvent.categoryId}
                placeholder={messages.placeholder.category}
                sx={{ display: 'flex' }}
              />
              <FormError errors={errorMessages} field={fields.category} />
              <Label sx={{ pt: 3, pb: 1 }}>{messages.label.beginAt}</Label>
              <DateTimePicker
                value={newEvent.beginAt}
                onChange={value => {
                  setNewEvent(prev => prev.withBeginAt(value))
                }}
                name={fields.beginAt}
                placeholder={messages.placeholder.beginAt}
              />
              <FormError errors={errorMessages} field={fields.beginAt} />
              <Label sx={{ pt: 3, pb: 1 }}>{messages.label.finishAt}</Label>
              <DateTimePicker
                value={newEvent.finishAt}
                onChange={value => {
                  setNewEvent(prev => prev.withFinishAt(value))
                }}
                name={fields.finishAt}
                placeholder={messages.placeholder.finishAt}
              />
              <FormError errors={errorMessages} field={fields.finishAt} />
              <Label sx={{ pt: 3, pb: 1 }}>{messages.label.timezone}</Label>
              <Select
                options={timezones}
                onChange={value => {
                  setNewEvent(prev => prev.withTimezone(value))
                }}
                value={newEvent.timezone}
                sx={{ display: 'flex' }}
              />
              <FormError errors={errorMessages} field={fields.timezone} />
              <Label sx={{ pt: 3, pb: 1 }}>{messages.label.address}</Label>
              <Places
                initialValue={newEvent.address?.route}
                onSelectPlace={p => {
                  setNewEvent(prev => prev.withAddress(p))
                }}
              />
              <FormError errors={errorMessages} field={fields.address} />
              <Box component="div" sx={{ display: 'flex', mt: 3 }}>
                <Input
                  placeholder={messages.placeholder.postalCode}
                  value={newEvent.address?.postalCode || ''}
                  disabled
                  sx={{ flex: 1 }}
                />
                <Input
                  placeholder={messages.placeholder.locality}
                  value={newEvent.address?.locality || ''}
                  disabled
                  sx={{ flex: 2, mx: 2 }}
                />
                <Input
                  placeholder={messages.placeholder.country}
                  value={newEvent.address?.country || ''}
                  disabled
                  sx={{ flex: 1 }}
                />
              </Box>
            </div>
          </div>
          <div>
            <div title={messages.step2}>
              <Label sx={{ pt: 3, pb: 1 }}>{messages.label.description}</Label>
              <TextArea
                multiline
                rows={6}
                fullWidth
                size="small"
                name={fields.description}
                placeholder={messages.placeholder.description}
                value={newEvent[fields.description]}
                onChange={e => {
                  setNewEvent(prev => prev.withDescription(e.target.value))
                }}
              />
              <FormError errors={errorMessages} field={fields.description} />
              <Label optional sx={{ pt: 3, pb: 1 }}>
                {messages.label.visio}
              </Label>
              <Input
                name={fields.visio}
                placeholder={messages.placeholder.visio}
                value={newEvent[fields.visio]}
                onChange={e => {
                  setNewEvent(prev => prev.withVisioUrl(e.target.value))
                }}
              />
              <FormError errors={errorMessages} field={fields.visio} />
              <Label optional sx={{ pt: 3, pb: 1 }}>
                {messages.label.capacity}
              </Label>
              <Input
                type="number"
                min="0"
                name={fields.capacity}
                placeholder={messages.placeholder.capacity}
                value={newEvent[fields.capacity]}
                onChange={e => {
                  setNewEvent(prev => prev.withCapacity(e.target.value))
                }}
              />
              <FormError errors={errorMessages} field={fields.capacity} />
              <FormControlLabel
                name={fields.private}
                label={messages.label.private}
                control={<Checkbox checked={!!newEvent.private} />}
                onChange={(_, value) => setNewEvent(prev => prev.withPrivate(value))}
                sx={{ pt: 2 }}
              />
              <FormControlLabel
                name={fields.electoral}
                label={messages.label.electoral}
                control={<Checkbox checked={!!newEvent.electoral} />}
                onChange={(_, value) => setNewEvent(prev => prev.withElectoral(value))}
                sx={{ pt: 1 }}
              />
            </div>
          </div>
        </Stepper>
        <Submit
          label={event.id ? messages.edit : messages.create}
          handleValidate={createOrEdit}
          disabled={validSteps.length < 2}
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
