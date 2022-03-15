import { Grid } from '@mui/material'
import PropTypes from 'prop-types'
import TextField from 'ui/TextField'
import { useErrorHandler } from 'components/shared/error/hooks'
import UIFormMessage from 'ui/FormMessage/FormMessage'

import { NEWS_OPTION, NEWS_CTA_TITLE, NEWS_CTA_TEXT, NEWS_CTA_PLACEHOLDER } from './constants'
import { SectionTitle, SubTitle, Option, Container, Body } from './styles'

const CallToActionContainer = ({ formik }) => {
  const { errorMessages } = useErrorHandler()
  return (
    <Container container sx={{ mb: 2 }}>
      <Grid item xs={12}>
        <Grid item xs={12}>
          <SectionTitle>{NEWS_CTA_TITLE}</SectionTitle>
          <Option>{NEWS_OPTION}</Option>
        </Grid>
        <Body component={'p'} sx={{ mt: 1 }}>
          {NEWS_CTA_TEXT}
        </Body>
        <Grid item xs={12} sx={{ mt: 1 }}>
          <SubTitle>Lien</SubTitle>
        </Grid>
        <Grid item xs={12}>
          <TextField formik={formik} label="url" placeholder="https://" />
        </Grid>
        {errorMessages
          .filter(({ field }) => field === 'external_link')
          .map(({ field, message }) => (
            <Grid item xs={12} key={field}>
              <UIFormMessage severity="error">{message}</UIFormMessage>
            </Grid>
          ))}
        <Grid item xs={12} sx={{ mt: 1 }}>
          <SubTitle>Texte du bouton</SubTitle>
        </Grid>
        <Grid item xs={12}>
          <TextField formik={formik} label="urlLabel" placeholder={NEWS_CTA_PLACEHOLDER} />
        </Grid>
        {errorMessages
          .filter(({ field }) => field === 'link_label')
          .map(({ field, message }) => (
            <Grid item xs={12} key={field}>
              <UIFormMessage severity="error">{message}</UIFormMessage>
            </Grid>
          ))}
      </Grid>
    </Container>
  )
}

CallToActionContainer.propTypes = {
  formik: PropTypes.object.isRequired,
}

export default CallToActionContainer
