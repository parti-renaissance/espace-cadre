import PropTypes from 'prop-types'

import { FormControlLabel } from '@mui/material'
import { Checkbox } from 'ui/Checkbox/Checkbox'

const CheckboxLabelStyles = {
  fontSize: '13px',
  fontWeight: 500,
  lineHeight: '20px',
  color: 'form.label.color',
  '&:first-letter': {
    textTransform: 'uppercase',
  },
}

const Feature = ({ name, label, value, handleChange }) => (
  <FormControlLabel
    data-cy="my-team-create-edit-feature"
    name={name}
    label={label}
    value={value}
    control={<Checkbox size="small" checked={!!value} sx={{ p: 1.5 }} />}
    onChange={(_, value) => handleChange(name, value)}
    componentsProps={{ typography: { sx: CheckboxLabelStyles } }}
    sx={{ height: '20px', mx: 0 }}
  />
)

Feature.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
}

export default Feature
