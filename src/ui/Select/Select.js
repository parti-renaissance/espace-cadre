import { ListItemText, MenuItem, Select as MuiSelect } from '@mui/material'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'

const Select = styled(MuiSelect)(
  ({ theme }) => `
  & .MuiSelect-select {
    background: ${theme.palette.gray100};
    border-radius: 8px;
  
    &:focus {
      background: ${theme.palette.gray100};
    }
  }
`
)

const UISelect = ({ value, onChange, options, placeholder = null }) => (
  <Select
    onChange={e => onChange(e.target.value)}
    value={value}
    renderValue={selected => options.find(o => o.key === selected)?.value || placeholder || ''}
    displayEmpty
    size="small"
    sx={{ width: '100%' }}
  >
    {placeholder && (
      <MenuItem value="" disabled>
        <ListItemText primary={placeholder} />
      </MenuItem>
    )}
    {options.map(({ key, value }) => (
      <MenuItem key={key} value={key}>
        <ListItemText primary={value} />
      </MenuItem>
    ))}
  </Select>
)

UISelect.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  placeholder: PropTypes.string,
}

export default UISelect
