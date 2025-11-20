import PropTypes from 'prop-types'
import { useCallback, useState } from 'react'
import { Autocomplete, Grid, Paper, Typography } from '@mui/material'
import { useQueryWithScope } from '~/api/useQueryWithScope'
import { getMyTeamActivists } from '~/api/my-team'
import { MyTeamMember as DomainMyTeamMember } from '~/domain/my-team'
import { useErrorHandler } from '~/components/shared/error/hooks'
import { useDebounce } from '~/components/shared/debounce'
import SelectOption from './shared/components/SelectOption'
import UIInputLabel from '~/ui/InputLabel/InputLabel'
import { Select } from './shared/components/styled'
import { roles } from '../shared/constants'
import { fields } from './shared/constants'
import UIFormMessage from '~/ui/FormMessage/FormMessage'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import Input from '~/ui/Input/Input'
import { useUserScope } from '~/redux/user/hooks.ts'
import { FeatureEnum } from '~/models/feature.enum.ts'

const messages = {
  input: {
    activist: 'Militant',
    role: 'Poste',
    custom_role: 'Rôle personnalisé',
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

const CreateEditActivistsAndRoles = ({ values = initialValues, updateValues, errors = [] }) => {
  const [inputValues, setInputValues] = useState(initialValues)
  const [isActivistFetchable, setIsActivistFetchable] = useState(false)
  // const [displayCustomRole, setDisplayCustomRole] = useState(false)
  const { handleError } = useErrorHandler()
  const [currentScope] = useUserScope()
  const debounce = useDebounce()

  const updateInputValues = useCallback((key, value) => {
    setInputValues(values => ({ ...values, [key]: value }))
  }, [])

  const { data: activists = [], isFetching: isActivistsFetching } = useQueryWithScope(
    ['activists', { feature: 'MyTeam', view: 'CreateEditActivistsAndRoles' }, inputValues.activist],
    () => getMyTeamActivists(inputValues.activist),
    {
      enabled: isActivistFetchable && (!!values.id || !areActivistInputAndValueEqual(inputValues, values)),
      onSuccess: () => setIsActivistFetchable(false),
      onError: handleError,
    }
  )

  const withCustomRole = currentScope.hasFeature(FeatureEnum.MY_TEAM_CUSTOM_ROLE)
  const availableRoleChoices = withCustomRole ? { ...roles, custom_role: 'Rôle personnalisé' } : roles

  return (
    <>
      <UIInputLabel data-cy="my-team-create-edit-activist-label" sx={{ pt: 4, pb: 1 }}>
        {messages.input.activist}
      </UIInputLabel>
      <Autocomplete
        data-cy="my-team-create-edit-activist-input"
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
        filterOptions={options => options}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={option =>
          `${[option.firstName, option.lastName, option.pid, option.emailAddress].filter(e => e).join(' ')}`
        }
        renderOption={(props, option) => (
          <SelectOption
            {...props}
            key={option.id}
            label={`${option.firstName} ${option.lastName}`}
            inputValue={inputValues.activist ?? ''}
            detail={`(${option.pid}, ${option.postCode}, ${option.emailAddress})`}
          />
        )}
        renderInput={params => <Input name={fields.activist} placeholder={messages.placeholder.activist} {...params} />}
        PaperComponent={props => <Paper {...props} sx={{ border: '1px solid', borderColor: 'gray300' }} />}
        ListboxProps={{ sx: { padding: 0 } }}
        loading={isActivistsFetching}
        loadingText={messages.pleaseWait}
        noOptionsText={messages.noResult}
        popupIcon={<SearchRoundedIcon />}
        autoComplete
        autoHighlight
        fullWidth
      />
      {errors
        .filter(({ field }) => field === 'adherent')
        .map(({ field, message }) => (
          <Grid item xs={12} key={field}>
            <UIFormMessage severity="error">{message}</UIFormMessage>
          </Grid>
        ))}

      <UIInputLabel data-cy="my-team-create-edit-role-label" sx={{ pt: 4, pb: 1 }}>
        {messages.input.role}
      </UIInputLabel>
      <Select
        data-cy="my-team-create-edit-role-input"
        name={fields.role}
        inputProps={{ placeholder: messages.placeholder.role }}
        value={values.role || ''}
        onChange={event => updateValues(fields.role, event.target.value)}
        renderValue={value =>
          availableRoleChoices[value] || <Typography sx={{ opacity: 0.4 }}>{messages.placeholder.role}</Typography>
        }
        displayEmpty
      >
        {Object.entries(availableRoleChoices).map(([value, label], index) => (
          <SelectOption key={index} label={label} value={value} sx={{ py: 1 }} />
        ))}
      </Select>
      {errors
        .filter(({ field }) => field === 'role')
        .map(({ field, message }) => (
          <Grid item xs={12} key={field}>
            <UIFormMessage severity="error">{message}</UIFormMessage>
          </Grid>
        ))}
      {withCustomRole && values.role === 'custom_role' && (
        <>
          <UIInputLabel sx={{ pt: 4, pb: 1 }}>{messages.input.custom_role}</UIInputLabel>
          <Input
            name={fields.customRole}
            value={values.customRole}
            onChange={event => updateValues(fields.customRole, event.target.value)}
          />
        </>
      )}
    </>
  )
}

CreateEditActivistsAndRoles.propTypes = {
  values: PropTypes.shape({
    activist: DomainMyTeamMember.propTypes.activist,
    role: PropTypes.string,
  }),
  updateValues: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string,
      message: PropTypes.string,
    })
  ),
}

export default CreateEditActivistsAndRoles
