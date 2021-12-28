import PropTypes from 'prop-types'
import DatePicker from '@mui/lab/DatePicker'
import { InputAdornment } from '@mui/material'
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded'

import { useDebounce } from 'components/shared/debounce'
import { FormError } from 'components/shared/error/components'
import { Input, Label } from '../shared/components'
import { useStepValues } from '../shared/hooks'

const messages = {
  input: {
    title: 'Titre',
    goal: 'Objectif individuel',
    brief: 'Brief',
    endDate: 'Date de fin',
  },
  placeholder: {
    title: 'Identifiant de la campagne',
    goal: "Nombre de questionnaires à remplir par l'utilisateur",
    endDate: '__  /__  /____',
    brief: 'Rédiger une brève',
  },
}

const initialvalues = {
  title: '',
  goal: '',
  endDate: '',
  brief: '',
}

const GlobalSettings = ({ errors = [] }) => {
  const { inputValues, updateInputValues, updateValues } = useStepValues(initialvalues)
  const debounce = useDebounce()

  return (
    <>
      <Label sx={{ pt: 3, pb: 1 }}>{messages.input.title}</Label>
      <Input
        name="title"
        placeholder={messages.placeholder.title}
        value={inputValues.title}
        onChange={event => {
          updateInputValues('title', event.target.value)
          debounce(() => updateValues('title', event.target.value))
        }}
        autoFocus
      />
      <FormError errors={errors} field="title" />

      <Label sx={{ pt: 5, pb: 1 }}>{messages.input.goal}</Label>
      <Input
        type="number"
        name="goal"
        placeholder={messages.placeholder.goal}
        value={inputValues.goal}
        onChange={event => {
          updateInputValues('goal', event.target.value)
          debounce(() => updateValues('goal', event.target.value))
        }}
      />
      <FormError errors={errors} field="goal" />

      <Label sx={{ pt: 5, pb: 1 }}>{messages.input.endDate}</Label>
      <DatePicker
        inputFormat="dd/MM/yyyy"
        value={inputValues.endDate}
        onChange={value => {
          updateInputValues('endDate', value)
          debounce(() => updateValues('endDate', value))
        }}
        renderInput={props => <Input type="date" name="endDate" {...props} />}
        inputProps={{ placeholder: messages.placeholder.endDate }}
        components={{ OpenPickerIcon: props => <CalendarTodayRoundedIcon size="small" {...props} /> }}
        InputAdornmentProps={{
          position: 'start',
          component: ({ children, ...props }) => (
            <InputAdornment position="start" sx={{ pl: 2 }} {...props}>
              {children}
            </InputAdornment>
          ),
        }}
      />
      <FormError errors={errors} field="finish_at" />

      <Label sx={{ pt: 5, pb: 1 }}>{messages.input.brief}</Label>
      <Input
        name="brief"
        placeholder={messages.placeholder.brief}
        onChange={event => {
          updateInputValues('brief', event.target.value)
          debounce(() => updateValues('brief', event.target.value))
        }}
        value={inputValues.brief}
        minRows={3}
        maxRows={3}
        multiline
      />
      <FormError errors={errors} field="brief" />
    </>
  )
}

GlobalSettings.propTypes = {
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
    })
  ),
}

export default GlobalSettings
