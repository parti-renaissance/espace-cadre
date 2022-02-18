import { ListItemText, ListSubheader, MenuItem, Select as MuiSelect } from '@mui/material'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import { useCallback } from 'react'

const Select = styled(MuiSelect)(
  ({ theme }) => `
  & .MuiSelect-select {
    background: ${theme.palette.gray100};
    border-radius: 8px;

    &:focus {
      background: ${theme.palette.gray100};
    }
  }

  & .MuiOutlinedInput-notchedOutline {
    border: none;
  }
`
)

const UISelect = ({ value, onChange, options, placeholder = null, renderValue, ...props }) => {
  const defaultRenderValue = useCallback(
    selected => options.find(o => o.key === selected)?.value || placeholder,
    [options, placeholder]
  )

  return (
    <Select
      {...props}
      size="small"
      onChange={e => onChange(e.target.value)}
      value={value}
      renderValue={renderValue || defaultRenderValue}
      displayEmpty
    >
      {placeholder && (
        <MenuItem value="" disabled>
          <ListItemText primary={placeholder} />
        </MenuItem>
      )}
      {options.map(({ key, value, group = false, disabled = false }) =>
        group ? (
          <ListSubheader key={key}>{value}</ListSubheader>
        ) : (
          <MenuItem key={key} value={key} disabled={disabled}>
            <ListItemText primary={value} />
          </MenuItem>
        )
      )}
    </Select>
  )
}

UISelect.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
      group: PropTypes.bool,
    })
  ).isRequired,
  placeholder: PropTypes.string,
  renderValue: PropTypes.func,
}

export default UISelect
