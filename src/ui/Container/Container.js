import { Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'

const useStyles = makeStyles(theme => ({
  root: {
    background: theme.palette.whiteCorner,
    borderRadius: '6px',
    boxShadow: '0 1px 1px 0 rgba(0, 0, 0, .04)',
    textAlign: textAlign => textAlign.textAlign,
  },
}))

const UIContainer = ({ children, rootClasses = '', textAlign = null, ...props }) => {
  const classes = useStyles({ textAlign })

  return (
    <Grid item className={`${classes.root} ${rootClasses}`} {...props}>
      {children}
    </Grid>
  )
}

export default UIContainer

UIContainer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.object]).isRequired,
  rootClasses: PropTypes.string,
  textAlign: PropTypes.string,
  sx: PropTypes.object,
  breakpoints: PropTypes.shape({
    xs: PropTypes.number,
    sm: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
    xl: PropTypes.number,
  }),
}
