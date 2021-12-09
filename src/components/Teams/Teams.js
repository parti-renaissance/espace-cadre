import { useState } from 'react'
import { useQuery } from 'react-query'
import { Container, Grid, Button } from '@mui/material'
import { makeStyles } from '@mui/styles'
import AddIcon from '@mui/icons-material/Add'
import TeamModal from './TeamModal'
import { getTeamsQuery } from 'api/teams'
import { Team } from 'domain/team'
import { useErrorHandler } from 'components/shared/error/hooks'
import PageTitle from 'ui/PageTitle'
import Header from './Card/Header'
import UICard, { Title } from 'ui/Card'
import Actions from './Card/Actions'

const useStyles = makeStyles(theme => ({
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
}))

const messages = {
  title: 'Équipes',
  create: 'Créer une équipe',
}

const Teams = () => {
  const classes = useStyles()
  const [currentTeam, setCurrentTeam] = useState(null)
  const [open, setOpen] = useState(false)
  const { handleError } = useErrorHandler()
  const { data: teams = [], refetch } = useQuery('teams', () => getTeamsQuery(), { onError: handleError })

  const handleNewTeam = () => {
    setCurrentTeam(Team.NULL)
    setOpen(true)
  }

  const handleEditTeam = id => {
    setCurrentTeam(teams.find(team => team.id === id))
    setOpen(true)
  }

  const handleCloseModal = () => {
    setOpen(false)
  }

  return (
    <Container maxWidth="lg">
      <Grid container justifyContent="space-between">
        <PageTitle title={messages.title} />
        <Grid item className={classes.buttonContainer}>
          <Button className={classes.createButton} onClick={handleNewTeam}>
            <AddIcon className={classes.icon} />
            {messages.create}
          </Button>
        </Grid>
      </Grid>
      {teams.length > 0 && (
        <Grid container spacing={2}>
          {teams.map(team => (
            <Grid item key={team.id} xs={12} sm={6} md={3} lg={3} xl={3}>
              <UICard
                header={
                  <>
                    <Header teamCount={team.members.length} />
                    <Title subject={team.name} author={team.creator} />
                  </>
                }
                actions={<Actions teamId={team.id} onEdit={() => handleEditTeam(team.id)} />}
              />
            </Grid>
          ))}
        </Grid>
      )}
      <TeamModal open={open} team={currentTeam} onCloseResolve={handleCloseModal} onSubmitResolve={refetch} />
    </Container>
  )
}

export default Teams
