import { Grid, makeStyles } from '@material-ui/core'
import PropTypes from 'prop-types'

const useStyles = makeStyles(theme => ({
  pageTitle: {
    fontSize: '24px',
    fontWeight: '400',
    color: theme.palette.gray800,
    marginBottom: theme.spacing(2),
  },
}))

const PageTitle = ({ page, xs }) => {
  const classes = useStyles()

  return (
    <Grid item xs={xs} className={classes.pageTitle}>
      {page}
    </Grid>
  )
}

export default PageTitle

PageTitle.propTypes = {
  page: PropTypes.string.isRequired,
  xs: PropTypes.bool,
}
