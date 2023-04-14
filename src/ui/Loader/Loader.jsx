import { CircularProgress, Box } from '@mui/material'
import PropTypes from 'prop-types'

const Loader = ({ size = 16, color = 'main', isCenter = false }) => {
  const loader = <CircularProgress size={size} sx={{ color }} />

  if (isCenter) {
    return (
      <Box sx={{ width: '100%', height: '20vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {loader}
      </Box>
    )
  }

  return loader
}

Loader.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  isCenter: PropTypes.bool,
}

export default Loader
