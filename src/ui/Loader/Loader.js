import { CircularProgress } from '@mui/material'
import PropTypes from 'prop-types'

const Loader = ({ size = 16, color = 'primary' }) => <CircularProgress size={size} sx={{ color }} />

Loader.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
}

export default Loader
