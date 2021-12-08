import PropTypes from 'prop-types'
import { Chip as MuiChip } from '@mui/material'

export const Chip = ({ label, color, bgcolor }) => (
  <MuiChip size="small" variant="filled" label={label} sx={{ color, bgcolor, height: '19px' }} />
)

Chip.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  color: PropTypes.string,
  bgcolor: PropTypes.string,
}
