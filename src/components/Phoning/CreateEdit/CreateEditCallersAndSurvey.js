import { useCallback, useContext, useState } from 'react'
import { Autocomplete } from '@mui/material'

import { useInfiniteQueryWithScope } from 'api/useQueryWithScope'
import { getNextPageParam, usePaginatedData } from 'api/pagination'
import { getPhoningCampaignTeams, getPhoningCampaignSurveys } from 'api/phoning'
import { useErrorHandler } from 'components/shared/error/hooks'
import pluralize from 'components/shared/pluralize/pluralize'
import { CallersAndSurveyContext } from './shared/context'
import SelectOption from './shared/components/SelectOption'
import { Input, Label } from './shared/components/styled'
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

  const { data: paginatedTeams = null, isFetching: isTeamsFetching } = useInfiniteQueryWithScope(
    'teams',
    pageParams => getPhoningCampaignTeams(pageParams),
    {
      getNextPageParam,
      onError: handleError,
    }
  )
  const { data: paginatedSurveys = null, isFetching: isSurveysFetching } = useInfiniteQueryWithScope(
    'surveys',
    pageParams => getPhoningCampaignSurveys(pageParams),
    {
      getNextPageParam,
      onError: handleError,
    }
  )

  const teams = usePaginatedData(paginatedTeams)
  const surveys = usePaginatedData(paginatedSurveys)

  return (
    <>
      <Label sx={{ pt: 3, pb: 1 }}>{messages.input.team}</Label>
      <Autocomplete
        options={teams}
        inputValue={inputValues.team?.name ?? ''}
        value={values.team}
        onInputChange={(_, value) => {
          updateInputValues(fields.team, { name: value })
        }}
        onChange={(_, value) => {
          updateValues(fields.team, value)
        }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={option => option.name ?? ''}
        renderOption={(props, option) => (
          <SelectOption
            {...props}
            key={option.id}
            label={option.name}
            inputValue={inputValues.team?.name ?? ''}
            detail={
              <>
                {'('}
                {option.membersCount}&nbsp;{pluralize(option.membersCount, messages.member)}
                {')'}
              </>
            }
          />
        )}
        renderInput={params => <Input name={fields.team} placeholder={messages.placeholder.team} {...params} />}
        loading={isTeamsFetching}
        loadingText={messages.pleaseWait}
        noOptionsText={messages.noResult}
        autoComplete
        autoHighlight
        fullWidth
      />

      <Label sx={{ pt: 5, pb: 1 }}>{messages.input.survey}</Label>
      <Autocomplete
        options={surveys}
        inputValue={inputValues.survey?.name ?? ''}
        value={values.survey}
        onInputChange={(_, value) => {
          updateInputValues(fields.survey, { name: value })
        }}
        onChange={(_, value) => {
          updateValues(fields.survey, value)
        }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={option => option.name ?? ''}
        renderOption={(props, option) => (
          <SelectOption
            {...props}
            key={option.id}
            label={option.name}
            inputValue={inputValues.survey?.name ?? ''}
            detail={<>{option.name}</>}
          />
        )}
        renderInput={params => <Input name={fields.survey} placeholder={messages.placeholder.survey} {...params} />}
        loading={isSurveysFetching}
        loadingText={messages.pleaseWait}
        noOptionsText={messages.noResult}
        autoComplete
        autoHighlight
        fullWidth
      />
    </>
  )
}

export default CreateEditCallersAndSurvey
