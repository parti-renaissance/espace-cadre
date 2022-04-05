import { useMemo } from 'react'
import { Container, Grid, useTheme } from '@mui/material'
import DatePicker from '@mui/lab/DatePicker'
import PropTypes from 'prop-types'

import { useInfiniteQueryWithScope } from 'api/useQueryWithScope'
import { getSurveysQuery } from 'api/surveys'
import { usePaginatedData } from 'api/pagination'
import { useErrorHandler } from 'components/shared/error/hooks'
import Loading from 'components/Dashboard/shared/Loading'
import TextField from 'ui/TextField'
import Select from 'ui/Select'
import MarkdownEditor from 'ui/MarkdownEditor'
import { visibility } from '../../../Surveys/shared/constants'
import { CTAContainer, FormTitle, SectionBody, SectionTitle, SubTitle } from '../../styles'

const messages = {
  label: {
    title: 'Titre',
    objective: 'Objectif individuel',
    startDate: 'Date de début',
    endDate: 'Date de fin',
    brief: 'Brief',
  },
  placeholder: {
    title: 'Ce titre identifiera la campagne auprès des militants',
    objective: 'Objectif donné à chaque militant en nombre de questionnaires remplis',
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

function Register({ formik, values, handleChange, errors, touched, handleBlur }) {
  const theme = useTheme()
  const { handleError } = useErrorHandler()

  const titleHasError = errors.title && touched.title
  const objectiveHasError = errors.objective && touched.objective
  const startDateHasError = errors.startDate && touched.startDate
  const endDateHasError = errors.endDate && touched.endDate
  const briefHasError = errors.brief && touched.brief
  const surveyHasError = errors.survey && touched.survey

  const editorInputHandler = (_, editor) => {
    formik.setFieldValue('brief', editor.getData())
  }

  const surveySelectHandler = changedItem => {
    formik.setFieldValue('survey', changedItem)
  }

  const startDateSelectHandler = selectedDate => {
    formik.setFieldValue('startDate', selectedDate)
  }

  const endtDateSelectHandler = selectedDate => {
    formik.setFieldValue('endDate', selectedDate)
  }

  const editorConfiguration = {
    toolbar: ['bold', 'italic', '|', 'bulletedList', 'numberedList', '|', 'link'],
  }

  const { data: paginatedSurveys = null, isLoading: isSurveysLoading } = useInfiniteQueryWithScope(
    ['paginated-surveys', { feature: 'Surveys', view: 'Surveys' }],
    getSurveysQuery,
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
      <FormTitle>{messages.label.title}</FormTitle>
      <Grid item xs={12} sx={{ mb: 2, mt: 1 }}>
        <TextField
          formik={formik}
          label="title"
          placeholder={messages.placeholder.title}
          onBlur={handleBlur}
          defaultValue={values.title}
          onChange={handleChange}
          error={titleHasError}
        />
      </Grid>
      <FormTitle>{messages.label.objective}</FormTitle>
      <Grid item xs={12} sx={{ mb: 2, mt: 1 }}>
        <TextField
          formik={formik}
          label="objective"
          placeholder={messages.placeholder.objective}
          onBlur={handleBlur}
          defaultValue={values.objective}
          onChange={handleChange}
          error={objectiveHasError}
        />
      </Grid>
      <Grid container sx={{ flexDirection: 'row', mb: 2, justifyContent: 'space-between' }}>
        <Grid item xs={5.7}>
          <FormTitle>{messages.label.startDate}</FormTitle>
          <DatePicker
            label="startDate"
            placeholder={messages.placeholder.startDate}
            value={values.startDate}
            onChange={startDateSelectHandler}
            renderInput={params => <TextField formik={formik} {...params} />}
            minDate={new Date()}
            error={startDateHasError}
          />
        </Grid>
        <Grid item xs={5.7}>
          <FormTitle>{messages.label.endDate}</FormTitle>
          <DatePicker
            label="endDate"
            name="startDate"
            value={values.endDate}
            onChange={endtDateSelectHandler}
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
          defaultValue={values.brief}
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
        <Grid item xs={12}>
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
  errors: PropTypes.object,
  touched: PropTypes.object,
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func,
}
