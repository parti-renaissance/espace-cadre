import { Accordion, AccordionDetails, AccordionSummary, Box, IconButton, Grid, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { createGroup, removeCandidate, deleteGroup } from 'api/committee_election'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { useErrorHandler } from 'components/shared/error/hooks'
import { notifyVariants } from 'components/shared/notification/constants'
import Button from 'ui/Button'
import Loader from 'ui/Loader'
import { useState } from 'react'
import AddCandidateModal from '../AddCandidateModal'

const messages = {
  add: 'Ajouter',
  addCandidate: 'Ajouter un candidat',
  noCandidate: 'Cette liste ne possède aucun candidat',
  list: 'Listes',
  description: 'Listes de tous les candidats de votre élection',
}

const Lists = ({ election }) => {
  const { handleError, errorMessages } = useErrorHandler()
  const { enqueueSnackbar } = useCustomSnackbar()
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false)
  const [selectedList, setSelectedList] = useState(null)
  const queryClient = useQueryClient()
  const onSuccess = () => queryClient.invalidateQueries({ queryKey: 'committee-election' })

  const { mutate: addList, isLoading } = useMutation(() => createGroup(election.uuid), {
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
    <Box data-cy="committee-detail-elections">
      <Box maxWidth="40%">
        <Box display="flex" alignItems="center" className="space-x-2">
          <Button onClick={addList} isMainButton>
            <AddIcon sx={{ color: 'main', fontSize: '20px' }} />
            {messages.add}
          </Button>
          {(isLoading || isDeleting) && <Loader />}
        </Box>
        <Typography component="p" sx={{ mt: 1, fontSize: '16px', color: theme => theme.palette.colors.gray[500] }}>
          {messages.description}
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {election.candidacies_groups.map((list, index) => (
          <Grid item xs={12} sm={6} lg={4} key={list.uuid} data-cy="election-list-card">
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-content-${index + 1}`}
                id={`panel-header-${index + 1}`}
              >
                <Box
                  sx={{ display: 'flex', flex: '1 1 0%', justifyContent: 'space-between', alignItems: 'center' }}
                  className="space-x-4"
                >
                  <Typography>Liste {index + 1}</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box
                  sx={{
                    pb: 1.5,
                    borderBottom: '1px solid',
                    borderBottomColor: theme => theme.palette.colors.gray[200],
                  }}
                >
                  {list.candidacies.length === 0 && <Typography>{messages.noCandidate}</Typography>}
                  {list.candidacies.length > 0 &&
                    list.candidacies.map(candidate => (
                      <Box display="flex" alignItems="center" my={1.5} key={candidate.uuid}>
                        <Typography sx={{ color: theme => theme.palette.colors.gray[900] }}>
                          {candidate.committee_membership.adherent.first_name}{' '}
                          {candidate.committee_membership.adherent.last_name}
                        </Typography>
                        <IconButton
                          edge="start"
                          color="inherit"
                          onClick={() => deleteCandidate(candidate.uuid)}
                          aria-label="delete"
                          sx={{ ml: 1 }}
                        >
                          <DeleteIcon sx={{ color: theme => theme.palette.form.error.color, fontSize: '20px' }} />
                        </IconButton>
                      </Box>
                    ))}
                </Box>
                <Box display="flex" alignItems="center" pt={1.5}>
                  <Button
                    onClick={() => toggleCreateEditModal(list.uuid, true)}
                    aria-label="add"
                    isMainButton
                    rootProps={{ sx: { fontSize: '12px', px: 1.5 } }}
                  >
                    <AddIcon sx={{ color: theme => theme.palette.colors.blue[500], fontSize: '20px' }} />
                    {messages.addCandidate}
                  </Button>
                  {list.candidacies.length === 0 && (
                    <IconButton
                      edge="start"
                      color="inherit"
                      onClick={() => deleteList(list.uuid)}
                      aria-label="delete"
                      sx={{ ml: 0.25 }}
                    >
                      <DeleteIcon sx={{ color: theme => theme.palette.form.error.color, fontSize: '20px' }} />
                    </IconButton>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}
      </Grid>

      {isCreateEditModalOpen && (
        <AddCandidateModal
          listId={selectedList}
          onAddSuccess={onSuccess}
          handleClose={() => toggleCreateEditModal(null, false)}
        />
      )}
    </Box>
  )
}

export default Lists

Lists.propTypes = {
  election: PropTypes.object.isRequired,
}
