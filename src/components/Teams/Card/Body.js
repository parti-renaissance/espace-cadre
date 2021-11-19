import React from 'react'
import { Grid, Button, makeStyles } from '@material-ui/core'
import { Link, generatePath } from 'react-router-dom'
import PATHS from '../../../paths'
import PropTypes from 'prop-types'
import TeamRename from './TeamRename'

const useStyles = makeStyles(theme => ({
  editButton: {
    fontSize: '13px',
    fontWeight: '500',
    color: theme.palette.lightBlue600,
    marginTop: theme.spacing(1.5),
    '&:hover': {
      background: theme.palette.teamBackground,
      borderRadius: '8.35px',
    },
  },
}))

const Body = ({ teamId, handleEditTeam }) => {
  const classes = useStyles()

  return (
    <Grid container className={classes.buttonContainer} justifyContent="space-between">
      <Grid item>
        <Link to={generatePath(PATHS.TEAMS_EDIT.route, { teamId })}>
          <Button className={classes.editButton}>Voir</Button>
        </Link>
      </Grid>
      <Grid item>
        <TeamRename handleEditTeam={() => handleEditTeam(teamId)} />
      </Grid>
    </Grid>
  )
}

Body.propTypes = {
  teamId: PropTypes.string.isRequired,
  handleEditTeam: PropTypes.func.isRequired,
}

export default Body
