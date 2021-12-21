import { useState } from 'react'
import { useQuery } from 'react-query'
import { useFormikContext } from 'formik'
import { Autocomplete, MenuItem, Typography } from '@mui/material'

import { getPhoningCampaignSurveys, getPhoningCampaignTeams } from 'api/phoning'
import { useErrorHandler } from 'components/shared/error/hooks'
import { FormError } from 'components/shared/error/components'
import { Input, Label } from '../shared/components'

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

const CallersAndSurvey = () => {
  const [teamInputValue, setTeamInputValue] = useState('')
  const [surveyInputValue, setSurveyInputValue] = useState('')
  const { values, setFieldValue } = useFormikContext()
  const { handleError, errorMessages } = useErrorHandler()

  const { data: teams = [], isFetching: isTeamsFetching } = useQuery(
    ['teams', teamInputValue],
    () => getPhoningCampaignTeams(teamInputValue),
    {
      enabled: !!teamInputValue && teamInputValue !== values?.team?.name,
      onError: handleError,
    }
  )
  const { data: surveys = [], isFetching: isSurveysFetching } = useQuery(
    ['surveys', surveyInputValue],
    () => getPhoningCampaignSurveys(surveyInputValue),
    {
      enabled: !!surveyInputValue && surveyInputValue !== values?.survey?.name,
      onError: handleError,
    }
  )

  return (
    <>
      <Label sx={{ pt: 3, pb: 1 }}>{messages.input.team}</Label>
      <Autocomplete
        options={teams}
        inputValue={teamInputValue}
        value={values?.team}
        onInputChange={(_, value) => {
          setTeamInputValue(value)
        }}
        onChange={(_, value) => {
          setFieldValue('team', value)
        }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={option => option.name || option}
        renderOption={(props, option) => (
          <MenuItem {...props} key={option.id}>
            <Typography>
              {option.name} ({option.author})
            </Typography>
          </MenuItem>
        )}
        renderInput={params => <Input name="team" placeholder={messages.placeholder.team} {...params} />}
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
        inputValue={surveyInputValue}
        value={values?.survey}
        onInputChange={(_, value) => {
          setSurveyInputValue(value)
        }}
        onChange={(_, value) => {
          setFieldValue('survey', value)
        }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={option => option.name || option}
        renderOption={(props, option) => (
          <MenuItem {...props} key={option.id}>
            <Typography>
              {option.name} ({option.type})
            </Typography>
          </MenuItem>
        )}
        renderInput={params => <Input name="survey" placeholder={messages.placeholder.survey} {...params} />}
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

export default CallersAndSurvey
