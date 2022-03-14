import { Grid, FormControlLabel } from '@mui/material'
import { Checkbox } from 'ui/Checkbox/Checkbox'
import PropTypes from 'prop-types'

import {
  NEWS_OPTION,
  NEWS_NOTIFICATION_TEXT_1,
  NEWS_NOTIFICATION_TEXT_2,
  NEWS_NOTIFICATION_TITLE,
  NEWS_SEND_NOTIFICATION,
} from './constants'

import { SectionTitle, Option, Container, Body } from './styles'

const NotificationContainer = ({ formik, isDisabled }) => (
  <Container container sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ opacity: isDisabled ? 0.15 : 1, pointerEvents: isDisabled ? 'none' : 'initial' }}>
      <Grid item xs={12}>
        <SectionTitle>{NEWS_NOTIFICATION_TITLE}</SectionTitle>
        <Option>{NEWS_OPTION}</Option>
      </Grid>
      <Body component={'p'} sx={{ mt: 1 }}>
        {NEWS_NOTIFICATION_TEXT_1}
      </Body>
      <Body component={'p'} sx={{ my: 1 }}>
        {NEWS_NOTIFICATION_TEXT_2}
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
        label={NEWS_SEND_NOTIFICATION}
      />
    </Grid>
  </Container>
)

NotificationContainer.propTypes = {
  formik: PropTypes.object.isRequired,
  isDisabled: PropTypes.bool,
}

export default NotificationContainer
