/* eslint-disable no-undef */
import { useMemo } from 'react'
import { Container, Grid, useTheme } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import PropTypes from 'prop-types'

import { useInfiniteQueryWithScope } from '~/api/useQueryWithScope'
import { getSurveysQuery } from '~/api/surveys'
import { usePaginatedData } from '~/api/pagination'
import { useErrorHandler } from '~/components/shared/error/hooks'
import Loading from '~/components/Dashboard/shared/Loading'
import TextField from '~/ui/TextField'
import Select from '~/ui/Select'
import MarkdownEditor from '~/ui/MarkdownEditor'
import UIFormMessage from '~/ui/FormMessage/FormMessage'
import { visibility } from '../../../Surveys/shared/constants'
import { CTAContainer, FormTitle, SectionBody, SectionTitle, SubTitle } from '../../styles'

const messages = {
  label: {
    title: 'Titre',
    goal: 'Objectif individuel',
    startDate: 'Date de début',
    endDate: 'Date de fin',
    brief: 'Brief',
  },
  placeholder: {
    title: 'Ce titre identifiera la campagne auprès des militants',
    goal: 'Objectif donné à chaque militant en nombre de questionnaires',
    startDate: 'JJ/MM/AAAA',
    endDate: 'JJ/MM/AAAA',
  },
  ctaTitle: 'Questions à poser lors du porte à porte',
  ctaText: 'Vous pouvez lier un questionnaire créé préalablement, même si celui-ci n’est pas publié.',
  ctaDropdownTitle: 'Questionnaire lié',
  selectionTitle: 'Sélectionnez une liste de bureaux de vote',
  pollingStations: 'bureaux de vote sélectionnés',
  electors: 'électeurs',
  addresses: 'adresses',
}

function Register({ formik, values, handleChange, formikErrors, errorMessages, touched, handleBlur }) {
  const theme = useTheme()
  const { handleError } = useErrorHandler()

  const titleHasError = formikErrors.title && touched.title
  const goalHasError = formikErrors.goal && touched.goal
  const startDateHasError = formikErrors.startDate && touched.startDate
  const endDateHasError = formikErrors.endDate && touched.endDate
  const briefHasError = formikErrors.brief && touched.brief
  const surveyHasError = formikErrors.survey && touched.survey

  const editorInputHandler = (_, editor) => {
    formik.setFieldValue('brief', editor.getData())
  }

  const surveySelectHandler = changedItem => {
    formik.setFieldValue('survey', changedItem)
  }

  const startDateSelectHandler = selectedDate => {
    formik.setFieldValue('startDate', selectedDate)
  }

  const endDateSelectHandler = selectedDate => {
    formik.setFieldValue('endDate', selectedDate)
  }

  const editorConfiguration = {
    toolbar: ['bold', 'italic', '|', 'bulletedList', 'numberedList', '|', 'link'],
  }

  const { data: paginatedSurveys = null, isLoading: isSurveysLoading } = useInfiniteQueryWithScope(
    ['paginated-surveys', { feature: 'Surveys', view: 'Surveys' }],
    () => getSurveysQuery('', '', true),
    {
      onError: handleError,
    }
  )
  const surveys = usePaginatedData(paginatedSurveys)

  const localSurveys = useMemo(() => surveys.filter(({ type }) => type === visibility.local), [surveys])
  const getSurveysOptions = () => {
    let data = []
    localSurveys.forEach(item => {
      data.push({ key: item.id, value: item.title })
    })
    return data
  }

  return (
    <Container maxWidth="sm" sx={{ mx: 'auto', flexDirection: 'column' }}>
      {errorMessages.map(({ message, index }) => (
        <Grid item xs={12} key={index}>
          <UIFormMessage severity="error">{message}</UIFormMessage>
        </Grid>
      ))}
      <FormTitle>{messages.label.title}</FormTitle>
      <Grid item xs={12} sx={{ mb: 2, mt: 1 }}>
        <TextField
          formik={formik}
          label="title"
          placeholder={messages.placeholder.title}
          onBlur={handleBlur}
          onChange={handleChange}
          error={titleHasError}
        />
      </Grid>
      <FormTitle>{messages.label.goal}</FormTitle>
      <Grid item xs={12} sx={{ mb: 2, mt: 1 }}>
        <TextField
          formik={formik}
          label="goal"
          type="number"
          InputProps={{ inputProps: { min: 1, max: 1000000 } }}
          placeholder={messages.placeholder.goal}
          onBlur={handleBlur}
          onChange={handleChange}
          error={goalHasError}
        />
      </Grid>
      <Grid container sx={{ flexDirection: 'row', mb: 2, justifyContent: 'space-between' }}>
        <Grid item xs={5.7}>
          <FormTitle>{messages.label.startDate}</FormTitle>
          <DateTimePicker
            label={messages.placeholder.startDate}
            value={values.startDate}
            onChange={startDateSelectHandler}
            renderInput={params => <TextField formik={formik} {...params} />}
            minDate={new Date()}
            error={startDateHasError}
          />
        </Grid>
        <Grid item xs={5.7}>
          <FormTitle>{messages.label.endDate}</FormTitle>
          <DateTimePicker
            label={messages.placeholder.endDate}
            value={values.endDate}
            onChange={endDateSelectHandler}
            renderInput={params => <TextField formik={formik} {...params} />}
            minDate={new Date()}
            error={endDateHasError}
          />
        </Grid>
      </Grid>
      <FormTitle>{messages.label.brief}</FormTitle>
      <Grid item xs={12} sx={{ mb: 2, pt: 1 }}>
        <MarkdownEditor
          formik={formik}
          data={values.brief}
          label="brief"
          config={editorConfiguration}
          onChange={editorInputHandler}
          error={briefHasError}
        />
      </Grid>
      <CTAContainer>
        <Grid item xs={12}>
          <SectionTitle>{messages.ctaTitle}</SectionTitle>
        </Grid>
        <SectionBody component={'p'} sx={{ mt: 1 }}>
          {messages.ctaText}
        </SectionBody>
        <Grid item xs={12} sx={{ mt: 1 }}>
          <SubTitle>{messages.ctaDropdownTitle}</SubTitle>
        </Grid>
        <Grid item xs={12} sx={{ mb: 1 }}>
          {isSurveysLoading && <Loading />}
          {!isSurveysLoading && (
            <Select
              sx={{ width: '100%', border: `1px solid ${theme.palette.gray300}` }}
              formik={formik}
              label="survey"
              onChange={surveySelectHandler}
              value={values.survey}
              options={getSurveysOptions()}
              error={surveyHasError}
            />
          )}
        </Grid>
      </CTAContainer>
    </Container>
  )
}

export default Register

Register.propTypes = {
  formik: PropTypes.object,
  values: PropTypes.object,
  formikErrors: PropTypes.object,
  errorMessages: PropTypes.array,
  touched: PropTypes.object,
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func,
}
