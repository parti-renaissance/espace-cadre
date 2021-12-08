import { Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'

const useStyles = makeStyles(theme => ({
  title: {
    fontSize: '24px',
    fontWeight: '400',
    color: theme.palette.gray800,
    marginBottom: theme.spacing(2),
  },
}))

const PageTitle = ({ title, breakpoints = { xs: null, sm: null, md: null, lg: null, xl: null } }) => {
  const classes = useStyles()

  return (
    <Grid
      item
      xs={breakpoints.xs}
      sm={breakpoints.sm}
      md={breakpoints.md}
      lg={breakpoints.lg}
      xl={breakpoints.xl}
      className={classes.title}
    >
      {title}
    </Grid>
  )
}

export default PageTitle

PageTitle.propTypes = {
  title: PropTypes.node.isRequired,
  breakpoints: PropTypes.shape({
    xs: PropTypes.number,
    sm: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
    xl: PropTypes.number,
  }),
}
