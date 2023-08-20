import { Box, Typography } from '@mui/material'
import PropTypes from 'prop-types'

const LineText = ({ label, value, labelStyle = {} }) => (
  <Box py={1.5} className="space-y-1">
    <Typography component="dt" sx={{ color: 'colors.gray.500', fontSize: '14px', ...labelStyle }}>
      {label}
    </Typography>
    {typeof value === 'string' ? (
      <Typography component="dd" sx={{ color: 'colors.gray.900', fontSize: '16px' }}>
        {value}
      </Typography>
    ) : (
      value
    )}
  </Box>
)

LineText.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  labelStyle: PropTypes.object,
}

export default LineText
