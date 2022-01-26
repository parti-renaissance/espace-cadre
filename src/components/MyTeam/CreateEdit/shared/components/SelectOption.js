import PropTypes from 'prop-types'
import { MenuItem, Typography } from '@mui/material'

import HightlightedText from './HighlightedText'

const SelectOption = ({ label, inputValue, detail, ...props }) => (
  <MenuItem {...props}>
    {!!inputValue && <HightlightedText text={label} inputText={inputValue} />}
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
  value: PropTypes.string,
  inputValue: PropTypes.string,
  detail: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
}

export default SelectOption
