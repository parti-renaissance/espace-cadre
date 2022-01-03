import { useState } from 'react'
import { useMutation } from 'react-query'
import { Container, Grid } from '@mui/material'
import TeamModal from './TeamModal'
import { createTeamQuery, getTeamsQuery, updateTeamQuery } from 'api/teams'
import { Team } from 'domain/team'
import { useErrorHandler } from 'components/shared/error/hooks'
import Header from './Card/Header'
import UICard, { Title } from 'ui/Card'
import Actions from './Card/Actions'
import { getNextPageParam, refetchUpdatedPage, usePaginatedData } from 'api/pagination'
import Loader from 'ui/Loader'
import InfiniteScroll from 'react-infinite-scroll-component'
import { notifyVariants } from 'components/shared/notification/constants'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import PageHeader from 'ui/PageHeader'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import { useInfiniteQueryWithScope } from 'api/useQueryWithScope'

const messages = {
  title: 'Groupes',
  create: 'Créer un groupe',
  createSuccess: 'Groupe créé avec succès',
  editSuccess: 'Le groupe a bien été modifié',
}

const Teams = () => {
  const [currentTeam, setCurrentTeam] = useState(null)
  const [open, setOpen] = useState(false)
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError, errorMessages, resetErrorMessages } = useErrorHandler()
  const {
    data: paginatedTeams = null,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQueryWithScope('teams', getTeamsQuery, {
    getNextPageParam,
    onError: handleError,
  })

  const { mutateAsync: createTeam, isLoading: isCreateLoading } = useMutation(createTeamQuery, {
    onSuccess: async () => {
      await refetch()
      enqueueSnackbar(messages.createSuccess, notifyVariants.success)
    },
    onError: handleError,
  })

  const { mutateAsync: updateTeam, isLoading: isUpdateLoading } = useMutation(updateTeamQuery, {
    onSuccess: async (_, updatedTeam) => {
      await refetchUpdatedPage(paginatedTeams, refetch, updatedTeam.id)
      enqueueSnackbar(messages.editSuccess, notifyVariants.success)
    },
    onError: handleError,
  })

  const teams = usePaginatedData(paginatedTeams)

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
    resetErrorMessages()
  }

  return (
    <Container maxWidth="lg" sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.title}
          button={<PageHeaderButton onClick={handleNewTeam} label={messages.create} />}
        />
      </Grid>
      {paginatedTeams && (
        <InfiniteScroll
          dataLength={teams.length}
          next={() => fetchNextPage()}
          hasMore={hasNextPage}
          loader={<Loader />}
        >
          <Grid container spacing={2}>
            {teams.map(team => (
              <Grid item key={team.id} xs={12} sm={6} md={3}>
                <UICard
                  rootProps={{ sx: { height: '168px' } }}
                  headerProps={{ sx: { pt: '21px' } }}
                  header={
                    <>
                      <Header teamCount={team.members.length} />
                      <Title subject={team.name} author={team.creator} sx={{ pt: 1 }} />
                    </>
                  }
                  actionsProps={{ sx: { pt: 3 } }}
                  actions={<Actions teamId={team.id} onEdit={() => handleEditTeam(team.id)} />}
                />
              </Grid>
            ))}
          </Grid>
        </InfiniteScroll>
      )}
      <TeamModal
        open={open}
        team={currentTeam}
        onCloseResolve={handleCloseModal}
        createTeam={createTeam}
        updateTeam={updateTeam}
        errors={errorMessages}
        loader={isCreateLoading || isUpdateLoading}
      />
    </Container>
  )
}

export default Teams
