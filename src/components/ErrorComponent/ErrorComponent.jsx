import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'

const useStyles = makeStyles(theme => ({
  errorBox: {
    textAlign: 'center',
    color: theme.palette.statusError,
    width: '100%',
    marginBottom: '16px',
    borderRadius: '6px',
  },
}))

const ErrorComponent = ({ errorMessage }) => {
  const classes = useStyles()

  return (
    <Box className={`with-background ${classes.errorBox}`}>
      <div className="chart-error">{errorMessage?.message}</div>
    </Box>
  )
}

ErrorComponent.propTypes = {
  errorMessage: PropTypes.shape({
    message: PropTypes.string,
  }),
}

export default ErrorComponent
