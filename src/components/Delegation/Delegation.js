import { useState } from 'react'
import { Container, Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'
import InfiniteScroll from 'react-infinite-scroll-component'

import { useInfiniteQueryWithScope } from 'api/useQueryWithScope'
import { getNextPageParam, usePaginatedData } from 'api/pagination'
import { getDelegationsQuery } from 'api/delegations'
import { useErrorHandler } from 'components/shared/error/hooks'
import PageHeader from 'ui/PageHeader'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import Loader from 'ui/Loader'
import EditIcon from 'ui/icons/EditIcon'
import DelegationItem from './DelegationItem'

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

const Delegation = () => {
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false)
  const { handleError } = useErrorHandler()

  const {
    data: paginatedDelegations = null,
    fetchNextPage: fetchNextPageDelegations,
    hasNextPage: hasNextPageDelegations,
    refetch: refetchDelegations,
  } = useInfiniteQueryWithScope('delegates', pageParams => getDelegationsQuery(pageParams), {
    getNextPageParam,
    onError: handleError,
  })
  const delegations = usePaginatedData(paginatedDelegations)
  console.log({ delegations })

  const handleUpdate = delegationId => () => {
    // TODO
  }

  const handleDelete = delegationId => () => {
    // TODO
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
        data-cy="phoning-campaigns-container"
        sx={{ pt: 4, ...infiniteScrollStylesOverrides }}
      >
        {delegations.length > 0 && (
          <InfiniteScroll
            dataLength={delegations.length}
            next={() => fetchNextPageDelegations()}
            hasMore={hasNextPageDelegations}
            loader={<Loader />}
          >
            <Grid container spacing={2} data-cy="phoning-campaigns-list">
              {delegations.map(delegation => (
                <DelegationItem
                  key={delegation.id}
                  firstName={delegation.firstName}
                  lastName={delegation.lastName}
                  role={delegation.role}
                  accessCount={delegation.accessCount}
                  handleUpdate={handleUpdate(delegation.id)}
                  handleDelete={handleDelete(delegation.id)}
                />
              ))}
            </Grid>
          </InfiniteScroll>
        )}
      </Grid>
    </Container>
  )
}

export default Delegation
