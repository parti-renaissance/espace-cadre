import PropTypes from 'prop-types'
import { MenuItem, Typography } from '@mui/material'

const SelectOption = ({ label, inputValue, detail, ...props }) => (
  <MenuItem {...props}>
    {!inputValue && (
      <Typography variant="subtitle1" sx={{ fontWeight: 400 }}>
        {label}
      </Typography>
    )}
    {detail && (
      <>
        &nbsp;
        <Typography variant="subtitle1" sx={{ fontWeight: 400 }}>
          {detail}
        </Typography>
      </>
    )}
  </MenuItem>
)

SelectOption.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  inputValue: PropTypes.string,
  detail: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
}

export default SelectOption
