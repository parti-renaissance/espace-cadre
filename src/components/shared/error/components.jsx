import { Grid } from '@mui/material'
import PropTypes from 'prop-types'

import UIFormMessage from 'ui/FormMessage/FormMessage'

export const FormError = ({ errors, field: fieldName }) => {
  if (!errors || !Array.isArray(errors)) {
    return null
  }
  return errors
    .filter(({ field }) => field === fieldName)
    .map(({ field, message }) => (
      <Grid item xs={12} key={field}>
        <UIFormMessage severity="error">{message}</UIFormMessage>
      </Grid>
    ))
}

FormError.propTypes = {
  errors: PropTypes.array.isRequired,
  field: PropTypes.string.isRequired,
}
