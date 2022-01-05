import { useCallback, useContext, useState } from 'react'
import { Autocomplete, MenuItem, Typography } from '@mui/material'

import { getDTDCampaignSurveys, getDTDCampaignTeams } from 'api/DTD'
import { useQueryWithScope } from 'api/useQueryWithScope'
import { useDebounce } from 'components/shared/debounce'
import { useErrorHandler } from 'components/shared/error/hooks'
import { FormError } from 'components/shared/error/components'
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
}

const CreateEditCallersAndSurvey = () => {
  const { values, initialValues, updateValues } = useContext(CallersAndSurveyContext)
  const [inputValues, setInputValues] = useState({ teamInput: '', surveyInput: '', ...initialValues })
  const [isTeamFetchable, setIsTeamFetchable] = useState(false)
  const [isSurveyFetchable, setIsSurveyFetchable] = useState(false)
  const { handleError, errorMessages } = useErrorHandler()
  const debounce = useDebounce()

  const updateInputValues = useCallback((key, value) => {
    setInputValues(values => ({ ...values, [key]: value }))
  }, [])

  const { data: teams = [], isFetching: isTeamsFetching } = useQueryWithScope(
    ['teams', inputValues.teamInput],
    () => getDTDCampaignTeams(inputValues.teamInput),
    {
      enabled: isTeamFetchable && !!inputValues.teamInput && inputValues.teamInput !== values.team?.name,
      onSuccess: () => {
        setIsTeamFetchable(false)
      },
      onError: handleError,
    }
  )
  const { data: surveys = [], isFetching: isSurveysFetching } = useQueryWithScope(
    ['surveys', inputValues.surveyInput],
    () => getDTDCampaignSurveys(inputValues.surveyInput),
    {
      enabled: isSurveyFetchable && !!inputValues.surveyInput && inputValues.surveyInput !== values.survey?.name,
      onSuccess: () => {
        setIsSurveyFetchable(false)
      },
      onError: handleError,
    }
  )

  return (
    <>
      <Label sx={{ pt: 3, pb: 1 }}>{messages.input.team}</Label>
      <Autocomplete
        options={teams}
        inputValue={inputValues.teamInput}
        value={values.team}
        onInputChange={(_, value) => {
          updateInputValues('teamInput', value)
          debounce(() => setIsTeamFetchable(true))
        }}
        onChange={(_, value) => {
          updateValues(fields.team, value)
        }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={option => option.name ?? ''}
        renderOption={(props, option) => (
          <MenuItem {...props} key={option.id}>
            <Typography>
              {option.name}
              {option.author && ` (${option.author})`}
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
      <FormError errors={errorMessages} field="team" />

      <Label sx={{ pt: 5, pb: 1 }}>{messages.input.survey}</Label>
      <Autocomplete
        options={surveys}
        inputValue={inputValues.surveyInput}
        value={values.survey}
        onInputChange={(_, value) => {
          updateInputValues('surveyInput', value)
          debounce(() => setIsSurveyFetchable(true))
        }}
        onChange={(_, value) => {
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
      <FormError errors={errorMessages} field="survey" />
    </>
  )
}

export default CreateEditCallersAndSurvey
