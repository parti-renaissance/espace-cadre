import PropTypes from 'prop-types'
import { useCallback, useState } from 'react'
import { Autocomplete, Paper, Typography } from '@mui/material'

import { useQueryWithScope } from 'api/useQueryWithScope'
import { getMyTeamActivists } from 'api/my-team'
import { MyTeamMember as DomainMyTeamMember } from 'domain/my-team'
import { useErrorHandler } from 'components/shared/error/hooks'
import { useDebounce } from 'components/shared/debounce'
import SelectOption from './shared/components/SelectOption'
import { Input, Label, Select } from './shared/components/styled'
import { roles, fields } from './shared/constants'

const messages = {
  input: {
    activist: 'Militant',
    role: 'Poste',
  },
  placeholder: {
    activist: 'Rechercher parmi vos militants',
    role: 'Quel est son poste dans votre équipe ?',
  },
  pleaseWait: 'Veuillez patienter..',
  noResult: 'Aucun résultat à afficher',
}

const initialValues = {
  activist: null,
  role: '',
}

const areActivistInputAndValueEqual = (input, value) =>
  input.activist === `${value.activist?.firstName ?? ''} ${value.activist?.lastName ?? ''}`

const CreateEditActivistsAndRoles = ({ values = initialValues, updateValues }) => {
  const [inputValues, setInputValues] = useState(initialValues)
  const [isActivistFetchable, setIsActivistFetchable] = useState(false)
  const { handleError } = useErrorHandler()
  const debounce = useDebounce()

  const updateInputValues = useCallback((key, value) => {
    setInputValues(values => ({ ...values, [key]: value }))
  }, [])

  const { data: activists = [], isFetching: isActivistsFetching } = useQueryWithScope(
    ['activists', { feature: 'MyTeam', view: 'CreateEditActivistsAndRoles' }, inputValues.activist],
    () => getMyTeamActivists(inputValues.activist),
    {
      enabled: isActivistFetchable && (!!values.id || !areActivistInputAndValueEqual(inputValues, values)),
      onSuccess: () => {
        setIsActivistFetchable(false)
      },
      onError: handleError,
    }
  )

  return (
    <>
      <Label sx={{ pt: 4, pb: 1 }}>{messages.input.activist}</Label>
      <Autocomplete
        options={activists}
        inputValue={inputValues.activist || ''}
        value={values.activist || ''}
        onInputChange={(_, value) => {
          updateInputValues(fields.activist, value)
          debounce(() => setIsActivistFetchable(true))
        }}
        onChange={(_, value) => {
          updateValues(fields.activist, value)
        }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={option =>
          `${option.firstName ?? ''}${option.firstName || option.lastName ? ' ' : ''}${option.lastName ?? ''}`
        }
        renderOption={(props, option) => (
          <SelectOption
            {...props}
            key={option.id}
            label={`${option.firstName} ${option.lastName}`}
            inputValue={inputValues.activist ?? ''}
            detail={
              <>
                {'('}
                {option.postCode}
                {')'}
              </>
            }
          />
        )}
        renderInput={params => <Input name={fields.activist} placeholder={messages.placeholder.activist} {...params} />}
        PaperComponent={props => <Paper {...props} sx={{ border: '1px solid', borderColor: 'gray300' }} />}
        ListboxProps={{ sx: { padding: 0 } }}
        loading={isActivistsFetching}
        loadingText={messages.pleaseWait}
        noOptionsText={messages.noResult}
        autoComplete
        autoHighlight
        fullWidth
      />

      <Label sx={{ pt: 4, pb: 1 }}>{messages.input.role}</Label>
      <Select
        name={fields.role}
        inputProps={{ placeholder: messages.placeholder.role }}
        value={values.role || ''}
        onChange={event => {
          updateValues(fields.role, event.target.value)
        }}
        renderValue={value =>
          roles[value] || <Typography sx={{ opacity: 0.4 }}>{messages.placeholder.role}</Typography>
        }
        displayEmpty
      >
        {Object.entries(roles).map(([value, label], index) => (
          <SelectOption key={index} label={label} value={value} sx={{ py: 1 }}>
            {label}
          </SelectOption>
        ))}
      </Select>
    </>
  )
}

CreateEditActivistsAndRoles.propTypes = {
  values: PropTypes.shape({
    activist: DomainMyTeamMember.propTypes.activist,
    role: PropTypes.string,
  }),
  updateValues: PropTypes.func.isRequired,
}

export default CreateEditActivistsAndRoles
