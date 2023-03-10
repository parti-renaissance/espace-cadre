import { useState } from 'react'
import { Box, Container, Grid, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import InfiniteScroll from 'react-infinite-scroll-component'
import { format } from 'date-fns'
import { AccessTime } from '@mui/icons-material'
import { generatePath, useNavigate } from 'react-router'
import { useInfiniteQueryWithScope } from 'api/useQueryWithScope'
import { getNextPageParam, usePaginatedData } from 'api/pagination'
import { useErrorHandler } from 'components/shared/error/hooks'
import Loader from 'ui/Loader'
import EmptyContent from 'ui/EmptyContent'
import PageHeader from 'ui/PageHeader'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import { getCommittees } from 'api/committees'
import Button from 'ui/Button'
import UICard from 'ui/Card/Card'
import CreateEditModal from './CreateEditModal'
import paths from 'shared/paths'

const messages = {
  title: 'Comités locaux',
  create: 'Créer un comité',
  noData: 'Aucun comité trouvé',
  edit: 'Modifier',
  view: 'Voir',
}

const Committees = () => {
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false)
  const { handleError } = useErrorHandler()
  const [committeeId, setCommitteeId] = useState(null)
  const navigate = useNavigate()

  const toggleCreateEditModal = (committeeId, open) => {
    setCommitteeId(committeeId)
    setIsCreateEditModalOpen(open)
  }

  const {
    data: paginatedCommittees = null,
    fetchNextPage,
    hasNextPage,
    refetch,
    isLoading,
  } = useInfiniteQueryWithScope(
    ['paginated-committees', { feature: 'Committees', view: 'Committees' }],
    getCommittees,
    {
      getNextPageParam,
      onError: handleError,
    }
  )

  const committees = usePaginatedData(paginatedCommittees)

  const handleView = committeeId => () => {
    navigate(generatePath(`${paths.committee}/:committeeId`, { committeeId }))
  }

  return (
    <Container maxWidth={false}>
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.title}
          button={
            <PageHeaderButton
              onClick={() => toggleCreateEditModal('-1', true)}
              label={messages.create}
              icon={<AddIcon />}
              isMainButton
            />
          }
        />
      </Grid>

      {isLoading && <Loader />}

      {(!committees || committees.length === 0) && <EmptyContent description={messages.noData} />}

      {committees && committees.length > 0 && (
        <InfiniteScroll
          dataLength={committees.length}
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={<Loader />}
          style={{ marginTop: '8px' }}
        >
          <Grid container spacing={2} data-cy="committees-grid">
            {committees.map(committee => (
              <Grid item xs={12} sm={6} md={3} lg={4} key={committee.uuid} data-cy="committee-card">
                <UICard
                  rootProps={{ sx: { pt: 2 } }}
                  header={
                    <>
                      <Typography
                        component="h2"
                        sx={{ fontWeight: '500', color: theme => theme.palette.colors.gray[900], fontSize: '16px' }}
                      >
                        {committee.name}
                      </Typography>
                    </>
                  }
                  content={
                    <Box className="space-y-3 my-4">
                      <Typography
                        component="p"
                        sx={{ color: theme => theme.palette.colors.gray[500], fontSize: '14px' }}
                      >
                        {committee.description}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
                        <AccessTime
                          sx={{ mr: 0.5, color: theme => theme.palette.colors.gray[400], fontSize: '15px' }}
                        />
                        <Typography variant="subtitle2" sx={{ color: theme => theme.palette.colors.gray[500] }}>
                          Créé Le {format(new Date(committee.created_at), 'dd/MM/yyyy')} à{' '}
                          {format(new Date(committee.created_at), 'HH:mm')}
                        </Typography>
                      </Box>
                    </Box>
                  }
                  actions={
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button onClick={handleView(committee.uuid)} isMainButton>
                        {messages.view}
                      </Button>
                      <Button
                        onClick={() => toggleCreateEditModal(committee.uuid, true)}
                        rootProps={{ sx: { color: 'whiteCorner', ml: 2 } }}
                      >
                        {messages.edit}
                      </Button>
                    </Box>
                  }
                />
              </Grid>
            ))}
          </Grid>
        </InfiniteScroll>
      )}

      {isCreateEditModalOpen && (
        <CreateEditModal
          open={isCreateEditModalOpen}
          committeeId={committeeId}
          handleClose={() => toggleCreateEditModal('-1', false)}
          onCreateResolve={refetch}
        />
      )}
    </Container>
  )
}

export default Committees
