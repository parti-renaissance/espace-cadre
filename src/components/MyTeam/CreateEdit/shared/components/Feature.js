import PropTypes from 'prop-types'

import { FormControlLabel, Grid } from '@mui/material'
import { Checkbox } from './styled'

const CheckboxLabelStyles = {
  fontSize: '13px',
  fontWeight: 500,
  lineHeight: '20px',
  color: 'form.label.color',
  '&:first-letter': {
    textTransform: 'uppercase',
  },
}

const Feature = ({ label, value, handleChange }) => (
  <Grid container direction="column" sx={{ pt: 1 }}>
    <FormControlLabel
      name={label}
      label={label}
      control={<Checkbox size="small" checked={!!value} sx={{ py: 0.25, px: 1.5 }} />}
      onChange={(_, value) => handleChange(label, value)}
      componentsProps={{ typography: { sx: CheckboxLabelStyles } }}
      sx={{ height: '20px', mx: 0 }}
    />
  </Grid>
)

Feature.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
}

export default Feature
