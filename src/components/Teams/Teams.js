import { useState } from 'react'
import { Container, Grid, Button } from '@mui/material'
import { makeStyles } from '@mui/styles'
import AddIcon from '@mui/icons-material/Add'
import { useQuery } from 'react-query'
import TeamModal from './TeamModal'
import { getTeamsQuery } from 'api/teams'
import { Team } from 'domain/team'
import PageTitle from 'ui/PageTitle'
import Card from 'ui/Card'
import Header from './Card/Header'
import Content from './Card/Content'

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
  create: 'Créer une équipe',
}

const Teams = () => {
  const classes = useStyles()
  const [currentTeam, setCurrentTeam] = useState(null)
  const [open, setOpen] = useState(false)
  const { data: teams = [], refetch } = useQuery('teams', () => getTeamsQuery())

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

  return (
    <Container maxWidth="lg" className={classes.teamsContainer}>
      <Grid container justifyContent="space-between">
        <PageTitle title={messages.title} />
        <Grid item className={classes.buttonContainer}>
          <Button className={classes.createButton} onClick={handleNewTeam}>
            <AddIcon className={classes.icon} />
            {messages.create}
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {teams.map(team => (
          <Card
            key={team.id}
            header={<Header teamCount={team.members.length} />}
            title={team.name}
            subtitle={team.creator}
          >
            <Content teamId={team.id} handleEditTeam={handleEditTeam} />
          </Card>
        ))}
      </Grid>
      <TeamModal open={open} handleClose={handleClose} teamItem={currentTeam} onSubmitResolve={refetch} />
    </Container>
  )
}

export default Teams
