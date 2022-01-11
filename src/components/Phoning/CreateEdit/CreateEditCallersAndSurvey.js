import { useCallback, useContext, useState } from 'react'
import { Autocomplete, MenuItem, Typography } from '@mui/material'

import { getPhoningCampaignTeams, getPhoningCampaignSurveys } from 'api/phoning'
import { useQueryWithScope } from 'api/useQueryWithScope'
import { useErrorHandler } from 'components/shared/error/hooks'
import pluralize from 'components/shared/pluralize/pluralize'
import { CallersAndSurveyContext } from './shared/context'
import { Input, Label } from './shared/components'
import { fields } from './shared/constants'

const messages = {
  input: {
    team: 'Equipe',
    survey: 'Questionnaire',
  },
  placeholder: {
    team: 'Groupe d’utilisateurs pouvant réaliser des appels',
    survey: "Questionnaire rempli durant l'appel",
  },
  pleaseWait: 'Veuillez patienter..',
  noResult: 'Aucun résultat à afficher',
  member: 'membre',
}

const CreateEditCallersAndSurvey = () => {
  const { values, initialValues, updateValues } = useContext(CallersAndSurveyContext)
  const [inputValues, setInputValues] = useState(initialValues)
  const { handleError } = useErrorHandler()

  const updateInputValues = useCallback((key, value) => {
    setInputValues(values => ({ ...values, [key]: value }))
  }, [])

  const { data: teams = [], isFetching: isTeamsFetching } = useQueryWithScope(
    'teams',
    () => getPhoningCampaignTeams(),
    {
      onError: handleError,
    }
  )
  const { data: surveys = [], isFetching: isSurveysFetching } = useQueryWithScope(
    'surveys',
    () => getPhoningCampaignSurveys(),
    {
      onError: handleError,
    }
  )

  return (
    <>
      <Label sx={{ pt: 3, pb: 1 }}>{messages.input.team}</Label>
      <Autocomplete
        options={teams}
        inputValue={inputValues.team?.name ?? ''}
        value={values.team}
        onChange={(_, value) => {
          updateInputValues(fields.team, value)
          updateValues(fields.team, value)
        }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={option => option.name ?? ''}
        renderOption={(props, option) => (
          <MenuItem {...props} key={option.id}>
            <Typography>
              {option.name}
              {Number.isInteger(option.membersCount) && (
                <>
                  &nbsp;{'('}
                  {option.membersCount}&nbsp;{pluralize(option.membersCount, messages.member)}
                  {')'}
                </>
              )}
            </Typography>
          </MenuItem>
        )}
        renderInput={params => <Input name={fields.team} placeholder={messages.placeholder.team} {...params} />}
        loading={isTeamsFetching}
        loadingText={messages.pleaseWait}
        noOptionsText={messages.noResult}
        autoComplete
        fullWidth
      />

      <Label sx={{ pt: 5, pb: 1 }}>{messages.input.survey}</Label>
      <Autocomplete
        options={surveys}
        inputValue={inputValues.survey?.name ?? ''}
        value={values.survey}
        onChange={(_, value) => {
          updateInputValues(fields.survey, value)
          updateValues(fields.survey, value)
        }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={option => option.name ?? ''}
        renderOption={(props, option) => (
          <MenuItem {...props} key={option.id}>
            <Typography>
              {option.name}
              {option.type && ` (${option.type})`}
            </Typography>
          </MenuItem>
        )}
        renderInput={params => <Input name={fields.survey} placeholder={messages.placeholder.survey} {...params} />}
        loading={isSurveysFetching}
        loadingText={messages.pleaseWait}
        noOptionsText={messages.noResult}
        autoComplete
        fullWidth
      />
    </>
  )
}

export default CreateEditCallersAndSurvey
