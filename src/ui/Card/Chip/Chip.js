import PropTypes from 'prop-types'
import { Chip as MuiChip } from '@mui/material'

export const Chip = ({ label, color, backgroundColor }) => (
  <MuiChip size="small" variant="filled" label={label} sx={{ color, backgroundColor }} />
)

Chip.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  color: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string.isRequired,
}
