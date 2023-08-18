import UIFormMessage from 'ui/FormMessage'
import { Grid } from '@mui/material'
import PropTypes from 'prop-types'

export default function FormError({ message }) {
  return message ? (
    <Grid item xs={12}>
      <UIFormMessage severity="error">{message}</UIFormMessage>
    </Grid>
  ) : null
}

FormError.propTypes = {
  message: PropTypes.string,
}
