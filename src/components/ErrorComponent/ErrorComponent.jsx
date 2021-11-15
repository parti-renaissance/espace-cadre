import { makeStyles, createStyles } from '@material-ui/core'
import PropTypes from 'prop-types'
import Card from 'ui/Card'

const useStyles = makeStyles(theme =>
  createStyles({
    errorBox: {
      textAlign: 'center',
      color: theme.palette.statusError,
      width: '100%',
      marginBottom: theme.spacing(2),
      padding: theme.spacing(2),
      borderRadius: '6px',
    },
  })
)

const ErrorComponent = ({ errorMessage }) => {
  const classes = useStyles()

  return <Card rootClasses={classes.errorBox}>{errorMessage?.message}</Card>
}

ErrorComponent.propTypes = {
  errorMessage: PropTypes.shape({
    message: PropTypes.string,
  }),
}

export default ErrorComponent
