import { Button, Box, createStyles, makeStyles } from '@material-ui/core'
import PropTypes from 'prop-types'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import Loader from 'ui/Loader'

const useStyles = makeStyles(theme =>
  createStyles({
    materialButton: {
      width: '100%',
      borderRadius: '8.35px',
      color: ({ disabled }) => (disabled ? '#6B7280 !important' : '#fff'),
      background: ({ disabled }) => (disabled ? '#E5E7EB' : '#2563EB'),
      '&:hover': {
        background: `${theme.palette.blue800} !important`,
      },
    },
    buttonIcon: {
      marginLeft: '12px',
    },
  })
)

const StepButton = ({ disabled, loading, onClick, label }) => {
  const classes = useStyles({ disabled })

  return (
    <Button className={classes.materialButton} onClick={disabled ? null : onClick} size="large" disabled={disabled}>
      <Box>{loading && <Loader />}</Box>
      {label}
      <ArrowForwardIcon className={classes.buttonIcon} />
    </Button>
  )
}

export default StepButton

StepButton.defaultProps = {
  disabled: false,
  loading: false,
}

StepButton.propTypes = {
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
}
