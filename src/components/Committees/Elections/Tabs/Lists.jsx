import PropTypes from 'prop-types'
import { useMemo, useState } from 'react'
import { Box, IconButton, Grid, Typography, LinearProgress, linearProgressClasses } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { styled } from '@mui/system'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { createGroup, removeCandidate, deleteGroup } from 'api/committee_election'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { useErrorHandler } from 'components/shared/error/hooks'
import { notifyVariants } from 'components/shared/notification/constants'
import { CommitteeElection } from 'domain/committee_election'
import Button from 'ui/Button'
import Loader from 'ui/Loader'
import { UIChip } from 'ui/Card'
import AddCandidateModal from '../AddCandidateModal'
import { GroupList } from '../../styles'

const messages = {
  add: 'Ajouter',
  noCandidate: 'Cette liste ne possède aucun candidat',
  list: 'Listes',
  description: 'Listes de tous les candidats de votre élection',
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.colors.gray[200],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.colors.blue[500],
  },
}))

const Lists = ({ election, isResultsLoading, results }) => {
  const { handleError, errorMessages } = useErrorHandler()
  const { enqueueSnackbar } = useCustomSnackbar()
  const enabledAction = election.isEditable()
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false)
  const [selectedList, setSelectedList] = useState(null)
  const queryClient = useQueryClient()
  const onSuccess = () => queryClient.invalidateQueries({ queryKey: 'committee-election' })
  const candidates = useMemo(() => election.groups.flatMap(group => group.candidacies), [election])

  const { mutate: addList, isLoading } = useMutation(() => createGroup(election.id), {
    onSuccess: onSuccess,
    onError: error => {
      handleError(error)
      enqueueSnackbar(errorMessages[0].message, notifyVariants.error)
    },
  })

  const { mutate: deleteList, isLoading: isDeleting } = useMutation(deleteGroup, { onSuccess: onSuccess })

  const { mutate: deleteCandidate } = useMutation(removeCandidate, { onSuccess: onSuccess })

  const toggleCreateEditModal = (list, open) => {
    setSelectedList(list)
    setIsCreateEditModalOpen(open)
  }

  return (
    <Box
      data-cy="committee-detail-elections"
      sx={{
        borderTop: '1px solid',
        borderTopColor: theme => theme.palette.colors.gray[200],
        pt: 2.5,
      }}
    >
      <Box maxWidth="40%">
        <Box display="flex" alignItems="center" className="space-x-4">
          <Typography sx={{ color: 'gray900', fontSize: '24px', fontWeight: '500' }}>
            Candidatures {isResultsLoading && <Loader size={20} />}
          </Typography>
          {enabledAction && (
            <Button onClick={addList} isMainButton>
              <AddIcon sx={{ color: 'main', fontSize: '20px' }} />
              {messages.add}
            </Button>
          )}
          {(isLoading || isDeleting) && <Loader />}
        </Box>
        <Typography component="p" sx={{ mt: 1, fontSize: '16px', color: theme => theme.palette.colors.gray[500] }}>
          {messages.description}
        </Typography>
      </Box>

      {election.status === 'closed' && results ? (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {results.candidate_group_results.map((item, index) => (
            <GroupList
              xs={12}
              sm={6}
              lg={4}
              key={index}
              index={index}
              header={
                <Box flex="1 1 0%" py={0.5}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography sx={{ fontSize: '16px', color: 'colors.gray.600' }}>
                      {item.candidate_group.title}
                    </Typography>
                    {item.candidate_group.elected && (
                      <UIChip
                        label="Liste élue"
                        labelStyle={{ fontSize: '14px' }}
                        color="teal700"
                        bgcolor="activeLabel"
                      />
                    )}
                  </Box>
                  <Box mt={1.5} display="flex" alignItems="center" justifyContent="space-between">
                    <Box flex="1 1 0%">
                      <BorderLinearProgress variant="determinate" value={item.rate} />
                    </Box>
                    <Typography sx={{ fontSize: '14px', color: 'colors.gray.600', ml: 2 }}>
                      {item.total} votes ({item.rate.toFixed(2)}%)
                    </Typography>
                  </Box>
                </Box>
              }
            >
              <Box className="space-y-2">
                {item.candidate_group.candidates.map((candidate, index) => (
                  <Typography key={index} component="h3" sx={{ color: 'colors.gray.900' }}>
                    {candidate.first_name} {candidate.last_name}
                  </Typography>
                ))}
              </Box>
            </GroupList>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {election.groups.map((list, index) => (
            <GroupList
              xs={12}
              sm={6}
              lg={4}
              key={list.uuid}
              index={list.uuid}
              header={
                <Typography sx={{ fontSize: '16px', color: theme => theme.palette.colors.gray[500] }}>
                  Liste {index + 1}
                </Typography>
              }
              canDropList={list.candidacies.length === 0 && enabledAction}
              dropList={list => deleteList(list.uuid)}
              canAddCandidate={enabledAction}
              addCandidate={() => toggleCreateEditModal(list.uuid, true)}
            >
              {list.candidacies.length === 0 && <Typography>{messages.noCandidate}</Typography>}
              {list.candidacies.length > 0 &&
                list.candidacies.map(candidate => (
                  <Box display="flex" alignItems="center" my={1.5} key={candidate.uuid}>
                    <Typography sx={{ color: 'colors.gray.900' }}>
                      {candidate.committee_membership.adherent.first_name}{' '}
                      {candidate.committee_membership.adherent.last_name}
                    </Typography>
                    {enabledAction && (
                      <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => deleteCandidate(candidate.uuid)}
                        aria-label="delete"
                        sx={{ ml: 1 }}
                      >
                        <DeleteIcon sx={{ color: 'form.error.color', fontSize: '20px' }} />
                      </IconButton>
                    )}
                  </Box>
                ))}
            </GroupList>
          ))}
        </Grid>
      )}

      {isCreateEditModalOpen && (
        <AddCandidateModal
          listId={selectedList}
          candidates={candidates}
          onAddSuccess={onSuccess}
          handleClose={() => toggleCreateEditModal(null, false)}
        />
      )}
    </Box>
  )
}

export default Lists

Lists.propTypes = {
  election: CommitteeElection.propTypes.isRequired,
  isResultsLoading: PropTypes.bool,
  results: PropTypes.object,
}
