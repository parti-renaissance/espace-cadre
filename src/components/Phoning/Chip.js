import PropTypes from 'prop-types'
import { Chip } from '@mui/material'

export const UIChip = ({ label, color, backgroundColor }) => (
  <Chip size="small" variant="filled" label={label} sx={{ color, backgroundColor }} />
)

UIChip.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.node.isRequired]).isRequired,
  color: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string.isRequired,
}

export default UIChip
