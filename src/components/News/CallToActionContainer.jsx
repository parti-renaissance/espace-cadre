import { Grid } from '@mui/material'
import PropTypes from 'prop-types'
import TextField from '~/ui/TextField'
import { useErrorHandler } from '~/components/shared/error/hooks'
import UIFormMessage from '~/ui/FormMessage/FormMessage'

import { Body, Container, Option, SectionTitle, SubTitle } from './styles'

const messages = {
  option: '(Optionnel)',
  title: 'Bouton d’action',
  text: 'Vous pouvez ajouter un bouton d’action qui s’affichera dans votre notification. Réservez cette fonctionnalité aux actions que doivent absolument faire vos militants à la lecture de la notification.',
  placeholder: 'Je m’engage',
}

const CallToActionContainer = ({ formik }) => {
  const { errorMessages } = useErrorHandler()
  return (
    <Container container sx={{ mb: 2 }} data-testid="callToAction-container">
      <Grid item xs={12}>
        <Grid item xs={12}>
          <SectionTitle>{messages.title}</SectionTitle>
          <Option>{messages.option}</Option>
        </Grid>
        <Body component={'p'} sx={{ mt: 1 }}>
          {messages.text}
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
          <TextField formik={formik} label="urlLabel" placeholder={messages.placeholder} />
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
