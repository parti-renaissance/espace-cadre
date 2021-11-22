import { Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'

const useStyles = makeStyles(theme => ({
  container: {
    marginBottom: theme.spacing(1),
  },
  chip: {
    fontSize: '10px',
    fontWeight: '500',
    borderRadius: '19px',
    padding: theme.spacing(0.25, 1),
  },
  active: {
    color: theme.palette.teal700,
    background: theme.palette.activeLabel,
    borderRadius: '19px',
  },
  inactive: {
    color: theme.palette.red600,
    background: theme.palette.inactiveLabel,
  },
  date: {
    fontSize: '10px',
    color: theme.palette.gray600,
    padding: theme.spacing(1),
  },
}))

const messages = {
  active: 'Active',
  inactive: 'Inactive',
}

const Header = ({ status, createdAt }) => {
  const classes = useStyles()

  return (
    <Grid container className={classes.container}>
      <Grid item>
        {status ? (
          <span className={`${classes.chip} ${classes.active}`}>{messages.active}</span>
        ) : (
          <span className={`${classes.chip} ${classes.inactive}`}>{messages.inactive}</span>
        )}
      </Grid>
      <Grid item className={classes.date}>
        Le {new Date(createdAt).toLocaleDateString()}
      </Grid>
    </Grid>
  )
}

Header.propTypes = {
  status: PropTypes.bool.isRequired,
  createdAt: PropTypes.string.isRequired,
}

export default Header
