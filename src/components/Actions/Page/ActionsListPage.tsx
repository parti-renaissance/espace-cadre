import { Button, ButtonGroup, Container, Grid, Stack, Typography } from '@mui/material'
import PageHeader from '~/ui/PageHeader'
import Iconify from '~/mui/iconify'
import { useNavigate } from 'react-router'
import { actionsRoutes } from '~/components/Actions/actionsRoutes'
import TabsComponent, { TabProps } from '~/components/Tabs/Tabs'
import { SyntheticEvent, useCallback, useEffect, useState } from 'react'
import useListActions from '~/api/Actions/Hooks/useListActions'
import ActionCard from '~/components/Actions/Components/ActionCard'
import { useIntersectionObserver } from '@uidotdev/usehooks'
import ActionsListSkeleton from '~/components/Actions/Components/ActionsListSkeleton'
import { withBottomSpacing } from '~/theme/spacing'
import Loader from '~/ui/Loader'

export default function ActionsListPage() {
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState<number>(0)
  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: '5px',
  })

  const onCreate = useCallback(() => navigate(actionsRoutes.create), [navigate])

  const onTabChange = useCallback((_: SyntheticEvent<Element, Event>, index: number) => setSelectedTab(index), [])

  const { aggregate, hasNextPage, isInitialLoading, isFetchingNextPage, isFetchingPreviousPage, fetchNextPage } =
    useListActions({})

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage) {
      fetchNextPage()
    }
  }, [entry?.isIntersecting, fetchNextPage, hasNextPage])

  return (
    <Container>
      <Grid container justifyContent="space-between">
        <PageHeader
          title={'Actions'}
          button={
            <Stack alignItems="center" direction="row" spacing={2}>
              <ButtonGroup variant="contained" color="inherit" size="medium">
                <Button
                  data-cy="ui-page-header-button"
                  startIcon={<Iconify icon="eva:plus-fill" color="white" />}
                  onClick={onCreate}
                  id={'action-create-button'}
                >
                  Créer une action
                </Button>
              </ButtonGroup>
            </Stack>
          }
        />
      </Grid>

      <Grid mb={2}>
        <TabsComponent elements={tabs} value={selectedTab} onChangeTab={onTabChange} />
      </Grid>

      {isFetchingPreviousPage && (
        <Grid item textAlign={'center'} {...withBottomSpacing}>
          <Loader />
        </Grid>
      )}

      {isInitialLoading && <ActionsListSkeleton count={12} />}

      <Grid container spacing={2}>
        {aggregate &&
          aggregate.map(item => (
            <Grid item xs={12} sm={6} md={4} key={item.uuid}>
              <ActionCard item={item} />
            </Grid>
          ))}
      </Grid>

      {isFetchingNextPage && (
        <Grid item textAlign={'center'} {...withBottomSpacing}>
          <Loader />
        </Grid>
      )}

      {/* Intersection observer for infinite scroll, do not remove. */}
      {!isInitialLoading && <div ref={ref} data-cy={'intersection-observer'} data-testid={'intersection-observer'} />}

      {!hasNextPage && aggregate.length > 0 && (
        <div style={{ textAlign: 'center' }}>
          <Typography color={'text.disabled'} fontSize={12}>
            Il n’y a pas d’autre résultats.
          </Typography>
        </div>
      )}
    </Container>
  )
}

const tabs: TabProps[] = [
  {
    id: 'allActions',
    label: 'Liste des actions',
  },
  {
    id: 'myEvents',
    label: 'Mes actions',
    count: 1,
  },
]
