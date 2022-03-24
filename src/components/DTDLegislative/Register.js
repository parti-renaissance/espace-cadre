import { Grid, useTheme } from '@mui/material'
import { useFormik } from 'formik'
import { useErrorHandler } from 'components/shared/error/hooks'
import TextField from 'ui/TextField'
import Select from 'ui/Select'
import UIFormMessage from 'ui/FormMessage/FormMessage'
import MarkdownEditor from 'ui/MarkdownEditor'
import { CTAContainer, FormTitle, SectionBody, SectionTitle, SubTitle } from './styles'

const messages = {
  formTitle: 'Titre',
  titlePlaceHolder: 'Ce titre identifiera la campagne auprès des militants',
  objective: 'Objectif individuel',
  objectivePlaceHolder: 'Objectif donné à chaque militant en nombre de questionnaires remplis',
  startDate: 'Date de début',
  startDatePlaceHolder: 'JJ/MM/AAAA',
  endDate: 'Date de fin',
  endDatePlaceHolder: 'JJ/MM/AAAA',
  brief: 'Brief',
  ctaTitle: 'Questions à poser lors du porte à porte',
  ctaText: 'Vous pouvez lier un questionnaire créé préalablement, même si celui-ci n’est pas publié.',
  ctaDropdownTitle: 'Questionnaire lié',
  selectionTitle: 'Sélectionnez une liste de bureaux de vote',
  pollingStations: 'bureaux de vote sélectionnés',
  electors: 'électeurs',
  addresses: 'adresses',
}

function Register() {
  const theme = useTheme()
  const { errorMessages } = useErrorHandler()
  const formik = useFormik({
    initialValues: {},
    validationSchema: {},
    enableReinitialize: true,
  })
  const editorConfiguration = {
    toolbar: ['bold', 'italic', '|', 'bulletedList', 'numberedList', '|', 'link'],
  }

  return (
    <Grid container sx={{ flexDirection: 'column' }}>
      <FormTitle>{messages.formTitle}</FormTitle>
      <Grid item xs={12} sx={{ mb: 2, mt: 1 }}>
        <TextField formik={formik} label="title" placeholder={messages.titlePlaceHolder} />
      </Grid>
      <FormTitle>{messages.objective}</FormTitle>
      <Grid item xs={12} sx={{ mb: 2, mt: 1 }}>
        <TextField formik={formik} label="objective" placeholder={messages.objectivePlaceHolder} />
      </Grid>
      <Grid container sx={{ flexDirection: 'row', mb: 2, justifyContent: 'space-between' }}>
        <Grid item xs={5.7}>
          <FormTitle>{messages.startDate}</FormTitle>
          <Grid item xs={12}>
            <TextField formik={formik} label="startDate" placeholder={messages.startDatePlaceHolder} />
          </Grid>
        </Grid>
        <Grid item xs={5.7}>
          <FormTitle>{messages.endDate}</FormTitle>
          <Grid item xs={12}>
            <TextField formik={formik} label="startDate" placeholder={messages.endDatePlaceHolder} />
          </Grid>
        </Grid>
      </Grid>
      <FormTitle>{messages.brief}</FormTitle>
      <Grid item xs={12} sx={{ mb: 2, pt: 1 }}>
        <MarkdownEditor
          formik={formik}
          data={formik.values['body']}
          label="brief"
          config={editorConfiguration}
          onChange={() => {}}
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
          <Select
            sx={{ width: '100%', border: `1px solid ${theme.palette.gray300}` }}
            formik={formik}
            label="survey"
            value="1"
            onChange={() => {}}
            options={[{ key: '1', value: 'test' }]}
          ></Select>
        </Grid>
        {errorMessages
          .filter(({ field }) => field === 'external_link')
          .map(({ field, message }) => (
            <Grid item xs={12} key={field}>
              <UIFormMessage severity="error">{message}</UIFormMessage>
            </Grid>
          ))}
      </CTAContainer>
    </Grid>
  )
}

export default Register
