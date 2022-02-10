import PropTypes from 'prop-types'
import { useCallback, useMemo, useContext, useState } from 'react'
import DatePicker from '@mui/lab/DatePicker'
import { InputAdornment, MenuItem, Select } from '@mui/material'
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded'

import { useDebounce } from 'components/shared/debounce'
import { FormError } from 'components/shared/error/components'
import { GlobalSettingsContext } from './shared/context'
import Input from 'ui/Input/Input'
import { fields } from './shared/constants'
import { useUserScope } from '../../../redux/user/hooks'
import Label from 'ui/Stepper/Label'
import { PickersDay } from 'ui/DateTime/styled'

const messages = {
  input: {
    title: 'Titre',
    zone: 'Zone',
    goal: 'Objectif individuel',
    brief: 'Brief',
    endDate: 'Date de fin',
  },
  placeholder: {
    title: 'Identifiant de la campagne',
    zone: 'Zone',
    goal: "Nombre de questionnaires à remplir par l'utilisateur",
    endDate: '__  /__  /____',
    brief: 'Rédiger une brève',
  },
}

const nationalScopes = ['national', 'national_communication', 'pap_national_manager', 'phoning_national_manager']

const CreateEditGlobalSettings = () => {
  const { errors, initialValues, updateValues } = useContext(GlobalSettingsContext)
  const [inputValues, setInputValues] = useState(initialValues)
  const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false)
  const debounce = useDebounce()
  const [currentScope] = useUserScope()
  const isNational = useMemo(() => nationalScopes.includes(currentScope.code), [currentScope.code])

  const updateInputValues = useCallback((key, value) => {
    setInputValues(values => ({ ...values, [key]: value }))
  }, [])

  return (
    <>
      <Label sx={{ pt: 3, pb: 1 }}>{messages.input.title}</Label>
      <Input
        name={fields.title}
        placeholder={messages.placeholder.title}
        value={inputValues.title}
        onChange={event => {
          updateInputValues(fields.title, event.target.value)
          debounce(() => updateValues(fields.title, event.target.value))
        }}
        autoFocus
      />
      <FormError errors={errors} field="title" />

      {!isNational && (
        <>
          <Label sx={{ pt: 5, pb: 1 }}>{messages.input.zone}</Label>
          <Select
            name={fields.zone}
            inputProps={{ placeholder: messages.placeholder.zone }}
            value={inputValues.zone}
            onChange={event => {
              updateInputValues(fields.zone, event.target.value)
              updateValues(fields.zone, event.target.value)
            }}
            renderValue={value => value.name}
            displayEmpty
            disabled={currentScope.zones.length === 1}
            size="small"
            sx={{
              width: '100%',
              bgcolor: 'gray100',
              '& fieldset': {
                border: 'none',
              },
            }}
          >
            {currentScope.zones.map(z => (
              <MenuItem key={z.uuid} value={z} sx={{ py: 1 }}>
                {z.name}
              </MenuItem>
            ))}
          </Select>
          <FormError errors={errors} field="zone" />{' '}
        </>
      )}

      <Label sx={{ pt: 5, pb: 1 }}>{messages.input.goal}</Label>
      <Input
        type="number"
        min="0"
        name={fields.goal}
        placeholder={messages.placeholder.goal}
        value={inputValues.goal}
        onChange={event => {
          updateInputValues(fields.goal, event.target.value)
          debounce(() => updateValues(fields.goal, event.target.value))
        }}
      />
      <FormError errors={errors} field="goal" />

      <Label sx={{ pt: 5, pb: 1 }}>{messages.input.endDate}</Label>
      <DatePicker
        inputFormat="dd/MM/yyyy"
        open={isEndDatePickerOpen}
        value={inputValues.endDate}
        onChange={value => {
          updateInputValues(fields.endDate, value)
          debounce(() => updateValues(fields.endDate, value))
        }}
        renderDay={(_, __, props) => <PickersDay {...props} />}
        renderInput={props => <Input type="date" name={fields.endDate} {...props} />}
        inputProps={{ placeholder: messages.placeholder.endDate, autoComplete: 'off' }}
        InputProps={{
          onClick: () => {
            setIsEndDatePickerOpen(true)
          },
        }}
        onClose={() => {
          setIsEndDatePickerOpen(false)
        }}
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
        name={fields.brief}
        placeholder={messages.placeholder.brief}
        onChange={event => {
          updateInputValues(fields.brief, event.target.value)
          debounce(() => updateValues(fields.brief, event.target.value))
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

CreateEditGlobalSettings.propTypes = {
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
    })
  ),
}

export default CreateEditGlobalSettings
