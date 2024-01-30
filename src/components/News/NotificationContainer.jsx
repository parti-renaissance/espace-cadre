import { Grid, FormControlLabel } from '@mui/material'
import { Checkbox } from '~/ui/Checkbox/Checkbox'
import PropTypes from 'prop-types'

import { SectionTitle, Option, Container, Body } from './styles'

const messages = {
  option: '(Optionnel)',
  firstText:
    'Vous pouvez, à la publication de cette actualité, l’envoyer par notification push à tous vos militants connectés et toujours abonnés aux notifications de l’application mobile.',
  secondText:
    'Attention, si vous abusez des push, vos militants se désabonneront des notifications de l’application mobile.',
  title: 'Notification push',
  sendNotification: 'Envoyer une notification push',
}

const NotificationContainer = ({ formik, isDisabled }) => (
  <Container container sx={{ mb: 2 }} data-testid="notification-container">
    <Grid item xs={12} sx={{ opacity: isDisabled ? 0.15 : 1, pointerEvents: isDisabled ? 'none' : 'initial' }}>
      <Grid item xs={12}>
        <SectionTitle>{messages.title}</SectionTitle>
        <Option>{messages.option}</Option>
      </Grid>
      <Body component={'p'} sx={{ mt: 1 }}>
        {messages.firstText}
      </Body>
      <Body component={'p'} sx={{ my: 1 }}>
        {messages.secondText}
      </Body>
      <FormControlLabel
        control={
          <Checkbox
            name="withNotification"
            size="small"
            checked={formik.values.withNotification}
            onChange={formik.handleChange}
          />
        }
        label={messages.sendNotification}
      />
    </Grid>
  </Container>
)

NotificationContainer.propTypes = {
  formik: PropTypes.object.isRequired,
  isDisabled: PropTypes.bool,
}

export default NotificationContainer
