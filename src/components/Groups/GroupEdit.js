import { useState } from 'react'
import { Container, Grid, Card, Paper as MuiPaper, Typography, Button as MuiButton, Box } from '@mui/material'
import { styled } from '@mui/system'
import { useParams } from 'react-router-dom'
import { useMutation } from 'react-query'
import { addGroupMemberQuery, deleteGroupMemberQuery, getGroupQuery } from 'api/groups'
import { adherentAutocompleteUri } from 'api/adherents'
import { notifyVariants } from 'components/shared/notification/constants'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { useErrorHandler } from 'components/shared/error/hooks'
import MemberCard from './MemberCard'
import Autocomplete from 'components/Filters/Element/Autocomplete'
import { format } from 'date-fns'
import { useQueryWithScope } from 'api/useQueryWithScope'

const PageTitle = styled(Typography)`
  font-size: 24px;
  font-weight: 400;
  color: ${({ theme }) => theme.palette.cyan800};
`

const AutocompleteContainer = styled(Card)(
  ({ theme }) => `
    border-radius: 8px;
    box-shadow: none;
    padding: ${theme.spacing(2)};
    margin-bottom: ${theme.spacing(2)};
`
)

const Title = styled(Grid)`
  font-size: 18px;
  font-weight: 400;
  color: ${({ theme }) => theme.palette.gray800};
`

const Button = styled(MuiButton)(({ theme }) => ({
  cursor: 'pointer',
  background: theme.palette.blue600,
  '&.Mui-disabled': {
    background: theme.palette.gray100,
  },
  '&:hover': {
    background: theme.palette.blue800,
  },
}))

const Paper = styled(MuiPaper)`
  padding: ${({ theme }) => theme.spacing(1, 2)};
  border-radius: 8px;
`

const messages = {
  group: 'Groupe',
  addMembers: 'Ajouter des membres',
  add: 'Ajouter',
  groupMember: 'Membres du groupe',
  noMember: 'Ce groupe ne contient aucun membre',
  editSuccess: 'Membre ajouté avec succès',
  deleteSuccess: 'Membre supprimé avec succès',
  adhesion: 'adhérent depuis le',
  placeholder: 'Rechercher un adhérent',
}

const GroupEdit = () => {
  const { groupId } = useParams()
  const [selectedMember, setSelectedMember] = useState(null)
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError } = useErrorHandler()

  const { data: group, refetch: refetchGroup } = useQueryWithScope(['group', groupId], () => getGroupQuery(groupId), {
    onError: handleError,
  })
  const { mutate: addGroupMember } = useMutation(addGroupMemberQuery, {
    onSuccess: () => {
      refetchGroup()
      enqueueSnackbar(messages.editSuccess, notifyVariants.success)
    },
    onError: handleError,
  })
  const { mutate: deleteGroupMember } = useMutation(deleteGroupMemberQuery, {
    onSuccess: () => {
      refetchGroup()
      enqueueSnackbar(messages.deleteSuccess, notifyVariants.success)
    },
    onError: handleError,
  })

  const handleAddGroupMember = () => {
    addGroupMember({ groupId, memberId: selectedMember.uuid })
  }

  const handleDelete = memberId => {
    deleteGroupMember({ groupId, memberId })
  }

  return (
    <Container maxWidth="lg" sx={{ mb: 2 }}>
      <Grid container>
        <Grid item sx={{ mb: 2 }}>
          <PageTitle>
            {messages.group} &gt; {group?.name}
          </PageTitle>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12} sm={8} lg={7}>
          <AutocompleteContainer>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {messages.addMembers}
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  placeholder={messages.placeholder}
                  customStyle={{ bgcolor: 'gray100' }}
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
                      <Box component="span" sx={{ fontStyle: 'italic' }}>
                        {option.postal_code}&#44;&nbsp;{messages.adhesion}&nbsp;
                        {format(new Date(option.registered_at), 'dd/MM/yyyy')}
                      </Box>
                    </li>
                  )}
                  getOptionLabel={option => `${option.first_name} ${option.last_name}`}
                />
              </Grid>
              <Grid item xs={12}>
                <Button onClick={handleAddGroupMember} disabled={!selectedMember}>
                  <Typography sx={{ color: 'whiteCorner' }}>{messages.add}</Typography>
                </Button>
              </Grid>
            </Grid>
          </AutocompleteContainer>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Title>{messages.groupMember}</Title>
        </Grid>
        {group?.members?.length > 0 &&
          group.members.map(member => (
            <MemberCard key={member.id} member={member} handleDelete={() => handleDelete(member.id)} />
          ))}
        {group?.members?.length === 0 && (
          <Grid item xs={6}>
            <Paper>
              <Typography variant="body1">{messages.noMember}</Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  )
}

export default GroupEdit
