import makeStyles from '@mui/styles/makeStyles'
import createStyles from '@mui/styles/createStyles'
import PropTypes from 'prop-types'
import UIContainer from 'ui/UIContainer'

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

  return <UIContainer rootClasses={classes.errorBox}>{errorMessage?.message}</UIContainer>
}

ErrorComponent.propTypes = {
  errorMessage: PropTypes.shape({
    message: PropTypes.string,
  }),
}

export default ErrorComponent
