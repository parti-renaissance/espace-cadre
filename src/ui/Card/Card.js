import { Grid, makeStyles } from '@material-ui/core'
import PropTypes from 'prop-types'

const useStyles = makeStyles(theme => ({
  root: {
    background: theme.palette.whiteCorner,
    borderRadius: '6px',
    boxShadow: '0 1px 1px 0 rgba(0, 0, 0, .04)',
    textAlign: textAlign => textAlign.textAlign,
  },
}))

const Card = ({ children, rootClasses = '', xs, sm, md, lg, xl, textAlign = null }) => {
  const classes = useStyles({ textAlign })

  return (
    <Grid item className={`${classes.root} ${rootClasses}`} xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
      {children}
    </Grid>
  )
}

export default Card

Card.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.object]).isRequired,
  rootClasses: PropTypes.string,
  textAlign: PropTypes.string,
  xs: PropTypes.number,
  sm: PropTypes.number,
  md: PropTypes.number,
  lg: PropTypes.number,
  xl: PropTypes.number,
}
