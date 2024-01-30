import { useState } from 'react'
import { Container, Grid, Card, Paper as MuiPaper, Typography, Box } from '@mui/material'
import { styled } from '@mui/system'
import { useParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { addGroupMemberQuery, deleteGroupMemberQuery, getGroupQuery } from '~/api/groups'
import { notifyVariants } from '~/components/shared/notification/constants'
import { useCustomSnackbar } from '~/components/shared/notification/hooks'
import { useErrorHandler } from '~/components/shared/error/hooks'
import MemberCard from './MemberCard'
import { useQueryWithScope } from '~/api/useQueryWithScope'
import paths from '~/shared/paths'
import PageHeader from '~/ui/PageHeader'
import Button from '~/ui/Button'
import Loader from '~/ui/Loader'
import AdherentAutocomplete from '~/components/Filters/Element/AdherentAutocomplete'
import { formatDate } from '~/shared/helpers'

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

const Paper = styled(MuiPaper)`
  padding: ${({ theme }) => theme.spacing(1, 2)};
  border-radius: 8px;
`

const messages = {
  group: 'Groupe',
  addMembers: 'Ajouter des militants',
  add: 'Ajouter',
  groupMember: 'Militants du groupe',
  noMember: 'Ce groupe ne contient aucun membre',
  editSuccess: 'Membre ajouté avec succès',
  deleteSuccess: 'Membre supprimé avec succès',
  adhesion: 'militant depuis le',
  placeholder: 'Rechercher un militant',
}

const GroupEdit = () => {
  const { groupId } = useParams()
  const [selectedMember, setSelectedMember] = useState(null)
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError } = useErrorHandler()

  const { data: group, refetch: refetchGroup } = useQueryWithScope(
    ['group', { feature: 'Groups', view: 'GroupEdit' }, groupId],
    () => getGroupQuery(groupId),
    {
      onError: handleError,
    }
  )
  const { mutate: addGroupMember, isLoading: isAddingGroupMember } = useMutation(addGroupMemberQuery, {
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
    <Container maxWidth={false} sx={{ mb: 2 }}>
      <Grid container>
        <Grid item sx={{ mb: 2 }}>
          <PageHeader title={messages.group} titleLink={paths.team} titleSuffix={group?.name} />
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
                <AdherentAutocomplete
                  placeholder={messages.placeholder}
                  customStyle={{ bgcolor: 'gray100' }}
                  value={selectedMember}
                  onChange={setSelectedMember}
                  renderOption={(props, option) => (
                    <li key={option.uuid} {...props}>
                      {option.first_name} {option.last_name}&#44;&nbsp;
                      <Box component="span" sx={{ fontStyle: 'italic' }}>
                        {option.postal_code}&#44;&nbsp;{messages.adhesion}&nbsp;
                        {formatDate(option.registered_at, 'dd/MM/yyyy')}
                      </Box>
                    </li>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Button onClick={handleAddGroupMember} disabled={!selectedMember || isAddingGroupMember}>
                  {isAddingGroupMember && <Loader />}&nbsp;
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
