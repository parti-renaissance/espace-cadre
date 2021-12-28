import { useState } from 'react'
import { useQuery } from 'react-query'
import { Autocomplete, MenuItem, Typography } from '@mui/material'

import { getPhoningCampaignSurveys, getPhoningCampaignTeams } from 'api/phoning'
import { useDebounce } from 'components/shared/debounce'
import { useErrorHandler } from 'components/shared/error/hooks'
import { FormError } from 'components/shared/error/components'
import { Input, Label } from '../shared/components'
import { useStepValues } from '../shared/hooks'

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

const initialvalues = {
  team: {
    name: '',
  },
  survey: {
    name: '',
  },
}

const CallersAndSurvey = () => {
  const [isTeamFetchable, setIsTeamFetchable] = useState(false)
  const [isSurveyFetchable, setIsSurveyFetchable] = useState(false)

  const { inputValues, values, updateInputValues, updateValues } = useStepValues(initialvalues)
  const { handleError, errorMessages } = useErrorHandler()
  const debounce = useDebounce()

  const { data: teams = [], isFetching: isTeamsFetching } = useQuery(
    ['teams', inputValues.team.name],
    () => getPhoningCampaignTeams(inputValues.team.name),
    {
      enabled: isTeamFetchable && !!inputValues.team.name && inputValues.team.name !== values.team?.name,
      onSuccess: () => {
        setIsTeamFetchable(false)
      },
      onError: handleError,
    }
  )
  const { data: surveys = [], isFetching: isSurveysFetching } = useQuery(
    ['surveys', inputValues.survey.name],
    () => getPhoningCampaignSurveys(inputValues.survey.name),
    {
      enabled: isSurveyFetchable && !!inputValues.survey.name && inputValues.survey.name !== values.survey?.name,
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
        inputValue={inputValues.team.name}
        value={values.team}
        onInputChange={(_, value) => {
          updateInputValues('team', { name: value })
          debounce(() => setIsTeamFetchable(true))
        }}
        onChange={(_, value) => {
          updateValues('team', value)
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
        inputValue={inputValues.survey.name}
        value={values.survey}
        onInputChange={(_, value) => {
          updateInputValues('survey', { name: value })
          debounce(() => setIsSurveyFetchable(true))
        }}
        onChange={(_, value) => {
          updateValues('survey', value)
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
