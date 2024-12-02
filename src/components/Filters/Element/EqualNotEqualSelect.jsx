import { FormControl, ListItemText, MenuItem, Select } from '@mui/material'
import PropTypes from 'prop-types'

const EqualNotEqualSelect = ({ value, onChange }) => (
  <FormControl>
    <Select value={value} onChange={onChange}>
      <MenuItem value={1}>
        <ListItemText primary={'='} />
      </MenuItem>
      <MenuItem value={0}>
        <ListItemText primary={'≠'} />
      </MenuItem>
    </Select>
  </FormControl>
)

export default EqualNotEqualSelect

EqualNotEqualSelect.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}
