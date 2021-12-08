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

const UIContainer = ({
  children,
  rootClasses = '',
  breakpoints = { xs: null, sm: null, md: null, lg: null, xl: null },
  sx = {},
  textAlign = null,
}) => {
  const classes = useStyles({ textAlign })

  return (
    <Grid
      item
      sx={sx}
      className={`${classes.root} ${rootClasses}`}
      xs={breakpoints.xs}
      sm={breakpoints.sm}
      md={breakpoints.md}
      lg={breakpoints.lg}
      xl={breakpoints.xl}
    >
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
