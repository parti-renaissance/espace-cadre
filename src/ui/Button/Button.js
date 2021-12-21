import { Button as MuiButton } from '@mui/material'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: '8px',
    padding: theme.spacing(1, 2),
  },
}))

const Button = ({ children, buttonClasses, handleClick, disabled }) => {
  const classes = useStyles()

  return (
    <MuiButton
      variant="contained"
      className={`${classes.root} ${buttonClasses}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </MuiButton>
  )
}

export default Button

Button.defaultProp = {
  disabled: false,
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  buttonClasses: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
}
