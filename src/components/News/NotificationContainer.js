import { Grid, Typography, FormControlLabel } from '@mui/material'
import { Checkbox } from 'ui/Checkbox/Checkbox'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'

import {
  NEWS_NOTIFICATION_OPTION,
  NEWS_NOTIFICATION_TEXT_1,
  NEWS_NOTIFICATION_TEXT_2,
  NEWS_NOTIFICATION_TITLE,
  NEWS_SEND_NOTIFICATION,
} from './constants'

const Container = styled(Grid)(
  ({ theme }) => `
    padding: ${theme.spacing(2)};
    margin-bottom: ${theme.spacing(2)};
    background-color: ${theme.palette.gray40};
    width: 100%;
    border-radius: 8px;
  `
)

const Title = styled(Typography)(
  ({ theme }) => `
    font-size: 20px;
    line-height: 20px;
    font-weight: 400;
    color: ${theme.palette.gray800};
  `
)

const Option = styled(Typography)(
  ({ theme }) => `
    font-size: 16px;
    line-height: 16px;
    font-weight: 400;
    color: ${theme.palette.gray300};
    margin-left: 4px;
    font-style: italic;
  `
)

const Body = styled(Typography)(
  ({ theme }) => `
    font-size: 14px;
    line-height: 21px;
    font-weight: 400;
    color: ${theme.palette.gray80};
  `
)

const NotificationContainer = ({ formik }) => (
  <Container container sx={{ mb: 2 }}>
    <Grid item xs={12}>
      <Grid item xs={12}>
        <Title>{NEWS_NOTIFICATION_TITLE}</Title>
        <Option>{NEWS_NOTIFICATION_OPTION}</Option>
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
}

export default NotificationContainer
