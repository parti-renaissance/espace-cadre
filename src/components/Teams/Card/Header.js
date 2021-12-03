import { Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import pluralize from 'components/shared/pluralize/pluralize'
import PropTypes from 'prop-types'

const useStyles = makeStyles(theme => ({
  container: {
    marginBottom: theme.spacing(1),
  },
  chip: {
    fontSize: '10px',
    fontWeight: '500',
    color: theme.palette.gray700,
    background: 'rgba(55, 65, 81, 0.08)',
    padding: theme.spacing(0.25, 1),
    borderRadius: '19px',
  },
}))

const messages = {
  member: 'membre',
}

const Header = ({ teamCount }) => {
  const classes = useStyles()

  return (
    <Grid container className={classes.container}>
      <Grid item>
        <span className={classes.chip}>
          {teamCount} {pluralize(teamCount, messages.member)}
        </span>
      </Grid>
    </Grid>
  )
}

Header.propTypes = {
  teamCount: PropTypes.number.isRequired,
}

export default Header
