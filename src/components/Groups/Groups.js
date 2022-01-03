import { useState } from 'react'
import { useMutation } from 'react-query'
import { Container, Grid } from '@mui/material'
import GroupModal from './GroupModal'
import { createGroupQuery, getGroupsQuery, updateGroupQuery } from 'api/groups'
import { Group } from 'domain/group'
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

const Groups = () => {
  const [currentGroup, setCurrentGroup] = useState(null)
  const [open, setOpen] = useState(false)
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError, errorMessages, resetErrorMessages } = useErrorHandler()
  const {
    data: paginatedGroups = null,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQueryWithScope('groups', getGroupsQuery, {
    getNextPageParam,
    onError: handleError,
  })

  const { mutateAsync: createGroup, isLoading: isCreateLoading } = useMutation(createGroupQuery, {
    onSuccess: async () => {
      await refetch()
      enqueueSnackbar(messages.createSuccess, notifyVariants.success)
    },
    onError: handleError,
  })

  const { mutateAsync: updateGroup, isLoading: isUpdateLoading } = useMutation(updateGroupQuery, {
    onSuccess: async (_, updatedGroup) => {
      await refetchUpdatedPage(paginatedGroups, refetch, updatedGroup.id)
      enqueueSnackbar(messages.editSuccess, notifyVariants.success)
    },
    onError: handleError,
  })

  const groups = usePaginatedData(paginatedGroups)

  const handleNewGroup = () => {
    setCurrentGroup(Group.NULL)
    setOpen(true)
  }

  const handleEditGroup = id => {
    setCurrentGroup(groups.find(group => group.id === id))
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
          button={<PageHeaderButton onClick={handleNewGroup} label={messages.create} />}
        />
      </Grid>
      {paginatedGroups && (
        <InfiniteScroll
          dataLength={groups.length}
          next={() => fetchNextPage()}
          hasMore={hasNextPage}
          loader={<Loader />}
        >
          <Grid container spacing={2}>
            {groups.map(group => (
              <Grid item key={group.id} xs={12} sm={6} md={3}>
                <UICard
                  rootProps={{ sx: { height: '168px' } }}
                  headerProps={{ sx: { pt: '21px' } }}
                  header={
                    <>
                      <Header groupCount={group.members.length} />
                      <Title subject={group.name} author={group.creator} sx={{ pt: 1 }} />
                    </>
                  }
                  actionsProps={{ sx: { pt: 3 } }}
                  actions={<Actions groupId={group.id} onEdit={() => handleEditGroup(group.id)} />}
                />
              </Grid>
            ))}
          </Grid>
        </InfiniteScroll>
      )}
      <GroupModal
        open={open}
        group={currentGroup}
        onCloseResolve={handleCloseModal}
        createGroup={createGroup}
        updateGroup={updateGroup}
        errors={errorMessages}
        loader={isCreateLoading || isUpdateLoading}
      />
    </Container>
  )
}

export default Groups
