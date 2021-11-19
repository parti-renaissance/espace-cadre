import { useState, useEffect } from 'react'
import { Container, Grid, Button } from '@mui/material'
import { makeStyles } from '@mui/styles'
import AddIcon from '@mui/icons-material/Add'
import TeamCard from './TeamCard'
import TeamModal from './TeamModal'
import { getTeams } from 'api/teams'
import { Team } from 'domain/team'
import PageTitle from 'ui/PageTitle'

const useStyles = makeStyles(theme => ({
  teamsContainer: {
    marginBottom: theme.spacing(2),
  },
  buttonContainer: {
    background: theme.palette.teamBackground,
    borderRadius: '8.35px',
    marginBottom: theme.spacing(2),
  },
  createButton: {
    color: theme.palette.lightBlue700,
    padding: theme.spacing(0.75, 1),
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  root: {
    padding: theme.spacing(2),
    borderRadius: '8.35px',
  },
}))

const messages = {
  title: 'Équipes',
}

const Teams = () => {
  const classes = useStyles()
  const [teams, setTeams] = useState([])
  const [currentTeam, setCurrentTeam] = useState(null)
  const [refreshPage, setRefreshPage] = useState(0)
  const [open, setOpen] = useState(false)

  const handleNewTeam = () => {
    setCurrentTeam(Team.NULL)
    setOpen(true)
  }

  const handleEditTeam = id => {
    setCurrentTeam(teams.find(team => team.id === id))
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    getTeams(setTeams)
  }, [refreshPage])

  return (
    <Container maxWidth="lg" className={classes.teamsContainer}>
      <Grid container justifyContent="space-between">
        <PageTitle title={messages.title} />
        <Grid item className={classes.buttonContainer}>
          <Button className={classes.createButton} onClick={handleNewTeam}>
            <AddIcon className={classes.icon} />
            Créer une équipe
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {teams.map(team => (
          <TeamCard key={team.id} team={team} handleEditTeam={handleEditTeam} />
        ))}
      </Grid>
      <TeamModal
        open={open}
        handleClose={handleClose}
        teamItem={currentTeam}
        onSubmitRefresh={() => {
          setRefreshPage(p => p + 1)
        }}
      />
    </Container>
  )
}

export default Teams
