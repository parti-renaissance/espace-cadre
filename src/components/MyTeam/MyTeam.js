import { useState } from 'react'
import { Container, Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'
import InfiniteScroll from 'react-infinite-scroll-component'

import { useInfiniteQueryWithScope } from 'api/useQueryWithScope'
import { getNextPageParam, usePaginatedData } from 'api/pagination'
import { getMyTeamQuery } from 'api/my-team'
import { useErrorHandler } from 'components/shared/error/hooks'
import PageHeader from 'ui/PageHeader'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import Loader from 'ui/Loader'
import EditIcon from 'ui/icons/EditIcon'
import MyTeamMember from './MyTeamMember'

const PageTitle = styled(Typography)`
  font-size: 24px;
  font-weight: 400;
  line-height: 36px;
`

const infiniteScrollStylesOverrides = {
  '& .infinite-scroll-component__outerdiv': {
    width: '100%',
  },
}

const messages = {
  pageTitle: 'Mon équipe',
  create: 'Ajouter un membre',
}

const MyTeam = () => {
  const [, setIsCreateEditModalOpen] = useState(false)
  const { handleError } = useErrorHandler()

  const {
    data: paginatedMyTeam = null,
    fetchNextPage: fetchNextPageMyTeam,
    hasNextPage: hasNextPageMyTeam,
  } = useInfiniteQueryWithScope(['my-team', { view: 'feature' }], pageParams => getMyTeamQuery(pageParams), {
    getNextPageParam,
    onError: handleError,
  })
  const myTeam = usePaginatedData(paginatedMyTeam)

  const handleUpdate = teamId => () => {
    // TODO
    teamId
  }

  const handleDelete = teamId => () => {
    // TODO
    teamId
  }

  return (
    <Container maxWidth="lg" sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageHeader
          title={<PageTitle sx={{ color: 'campaigncolor' }}>{messages.pageTitle}</PageTitle>}
          button={
            <PageHeaderButton
              label={messages.create}
              icon={<EditIcon sx={{ color: 'campaign.color', fontSize: '20px' }} />}
              onClick={() => setIsCreateEditModalOpen(true)}
            />
          }
        />
      </Grid>

      <Grid
        container
        justifyContent="space-between"
        data-cy="my-team-container"
        sx={{ pt: 4, ...infiniteScrollStylesOverrides }}
      >
        {myTeam.length > 0 && (
          <InfiniteScroll
            dataLength={myTeam.length}
            next={() => fetchNextPageMyTeam()}
            hasMore={hasNextPageMyTeam}
            loader={<Loader />}
          >
            <Grid container spacing={2} data-cy="my-team-list">
              {myTeam.members.map(member => (
                <MyTeamMember
                  key={member.id}
                  role={member.role}
                  adherent={member.adherent}
                  accessCount={member.accessCount}
                  handleUpdate={handleUpdate(member.id)}
                  handleDelete={handleDelete(member.id)}
                />
              ))}
            </Grid>
          </InfiniteScroll>
        )}
      </Grid>
    </Container>
  )
}

export default MyTeam
