import PropTypes from 'prop-types'
import { useCallback, useMemo, useContext, useState } from 'react'
import { MenuItem, Select } from '@mui/material'

import { useDebounce } from 'components/shared/debounce'
import { FormError } from 'components/shared/error/components'
import DateTimePicker from 'ui/DateTime/DateTimePicker'
import UIInput from 'ui/Input/Input'
import UIInputLabel from 'ui/InputLabel/InputLabel'
import { nationalScopes } from 'shared/scopes'
import { GlobalSettingsContext } from './shared/context'
import { fields } from './shared/constants'
import { useUserScope } from '../../../redux/user/hooks'

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

const CreateEditGlobalSettings = () => {
  const { errors, initialValues, updateValues } = useContext(GlobalSettingsContext)
  const [inputValues, setInputValues] = useState(initialValues)
  const debounce = useDebounce()
  const [currentScope] = useUserScope()
  const isNational = useMemo(() => nationalScopes.includes(currentScope.code), [currentScope.code])

  const updateInputValues = useCallback((key, value) => {
    setInputValues(values => ({ ...values, [key]: value }))
  }, [])

  return (
    <>
      <UIInputLabel sx={{ pt: 3, pb: 1 }}>{messages.input.title}</UIInputLabel>
      <UIInput
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
          <UIInputLabel sx={{ pt: 5, pb: 1 }}>{messages.input.zone}</UIInputLabel>
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

      <UIInputLabel sx={{ pt: 5, pb: 1 }}>{messages.input.goal}</UIInputLabel>
      <UIInput
        type="number"
        InputProps={{ inputProps: { min: 1, max: 1000000 } }}
        name={fields.goal}
        placeholder={messages.placeholder.goal}
        value={inputValues.goal}
        onChange={event => {
          updateInputValues(fields.goal, event.target.value)
          debounce(() => updateValues(fields.goal, event.target.value))
        }}
      />
      <FormError errors={errors} field="goal" />

      <UIInputLabel sx={{ pt: 5, pb: 1 }}>{messages.input.endDate}</UIInputLabel>
      <DateTimePicker
        value={inputValues.endDate}
        onChange={value => {
          updateInputValues(fields.endDate, value)
          debounce(() => updateValues(fields.endDate, value))
        }}
        placeholder={messages.placeholder.endDate}
      />
      <FormError errors={errors} field="finish_at" />

      <UIInputLabel sx={{ pt: 5, pb: 1 }}>{messages.input.brief}</UIInputLabel>
      <UIInput
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
        sx={{ p: 1.75 }}
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
