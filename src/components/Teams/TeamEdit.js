import { useState } from 'react'
import { Container, Grid, Card, Paper, Typography, Button } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { styled } from '@mui/system'
import { useParams } from 'react-router-dom'
import { useMutation } from 'react-query'
import { addTeamMemberQuery, deleteTeamMemberQuery, getTeamQuery } from 'api/teams'
import { adherentAutocompleteUri } from 'api/adherents'
import { notifyVariants } from 'components/shared/notification/constants'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { useErrorHandler } from 'components/shared/error/hooks'
import MemberCard from './MemberCard'
import Autocomplete from 'components/Filters/Element/Autocomplete'
import { format } from 'date-fns'
import { useQueryScope } from 'api/useQueryScope'

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: '8px',
    boxShadow: 'none',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  buttonClasses: {
    color: theme.palette.whiteCorner,
    background: theme.palette.blue600,
    '&:hover': {
      background: theme.palette.blue800,
    },
  },
  teamsContainer: {
    marginBottom: theme.spacing(2),
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: '400',
    color: theme.palette.cyan800,
    marginBottom: theme.spacing(2),
  },
  title: {
    fontSize: '18px',
    fontWeight: '400',
    color: theme.palette.gray800,
  },
  noMember: {
    padding: theme.spacing(1, 2),
    borderRadius: '8px',
  },
  autocomplete: {
    background: theme.palette.gray100,
  },
}))

const Italic = styled('span')`
  font-style: italic;
`

const messages = {
  addMembers: 'Ajouter des membres',
  add: 'Ajouter',
  teamMember: "Membres de l'équipe",
  noMember: 'Cette équipe ne contient aucun membre',
  editSuccess: 'Membre ajouté avec succès',
  deleteSuccess: 'Membre supprimé avec succès',
  adhesion: 'adhérent depuis le',
}

const TeamEdit = () => {
  const classes = useStyles()
  const { teamId } = useParams()
  const [selectedMember, setSelectedMember] = useState(null)
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError } = useErrorHandler()

  const { data: team, refetch: refetchTeam } = useQueryScope(['team', teamId], () => getTeamQuery(teamId), {
    onError: handleError,
  })
  const { mutate: addTeamMember } = useMutation(addTeamMemberQuery, {
    onSuccess: () => {
      refetchTeam()
      enqueueSnackbar(messages.editSuccess, notifyVariants.success)
    },
    onError: handleError,
  })
  const { mutate: deleteTeamMember } = useMutation(deleteTeamMemberQuery, {
    onSuccess: () => {
      refetchTeam()
      enqueueSnackbar(messages.deleteSuccess, notifyVariants.success)
    },
    onError: handleError,
  })

  const handleAddTeamMember = () => {
    addTeamMember({ teamId, memberId: selectedMember.uuid })
  }

  const handleDelete = memberId => {
    deleteTeamMember({ teamId, memberId })
  }

  return (
    <Container maxWidth="lg" className={classes.teamsContainer}>
      <Grid container>
        <Grid item className={classes.pageTitle}>
          Équipes &gt; {team?.name}
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12} sm={8} lg={7}>
          <Card className={classes.root}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {messages.addMembers}
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  placeholder="Rechercher un adhérent"
                  autoCompleteStyle={classes.autocomplete}
                  uri={adherentAutocompleteUri}
                  queryParam="q"
                  valueParam="uuid"
                  value={selectedMember}
                  onChange={v => {
                    setSelectedMember(v.uuid ? v : null)
                  }}
                  renderOption={(props, option) => (
                    <li key={option.uuid} {...props}>
                      {option.first_name} {option.last_name}&#44;&nbsp;
                      <Italic>
                        {option.postal_code}&#44;&nbsp;{messages.adhesion}&nbsp;
                        {format(new Date(option.registered_at), 'dd/MM/yyyy')}
                      </Italic>
                    </li>
                  )}
                  getOptionLabel={option => `${option.first_name} ${option.last_name}`}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  buttonClasses={classes.buttonClasses}
                  handleClick={handleAddTeamMember}
                  disabled={!selectedMember}
                >
                  {messages.add}
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} className={classes.title}>
          {messages.teamMember}
        </Grid>
        {team?.members.length > 0 ? (
          team?.members?.map(member => (
            <MemberCard key={member.id} member={member} handleDelete={() => handleDelete(member.id)} />
          ))
        ) : (
          <Grid item xs={6}>
            <Paper className={classes.noMember}>
              <Typography variant="body1">{messages.noMember}</Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  )
}

export default TeamEdit
