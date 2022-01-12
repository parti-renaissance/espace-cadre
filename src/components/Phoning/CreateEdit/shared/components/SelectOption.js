import PropTypes from 'prop-types'
import { MenuItem, Typography } from '@mui/material'

import HightlightedText from './HighlightedText'

const SelectOption = ({ label, inputValue, detail, ...props }) => (
  <MenuItem {...props}>
    <HightlightedText text={label} inputText={inputValue} />
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
  inputValue: PropTypes.string.isRequired,
  detail: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
}

export default SelectOption
