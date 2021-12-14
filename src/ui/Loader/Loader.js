import { CircularProgress } from '@mui/material'
import PropTypes from 'prop-types'

const Loader = ({ size = 16 }) => <CircularProgress size={size} />

Loader.propTypes = {
  size: PropTypes.number,
}

export default Loader
