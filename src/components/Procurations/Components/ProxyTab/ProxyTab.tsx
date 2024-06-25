import { Button, Grid, Typography } from '@mui/material'
import { useDebounce, useIntersectionObserver } from '@uidotdev/usehooks'
import { memo, useEffect, useState } from 'react'
import useProcurationProxies from '~/api/Procuration/Hooks/useProcurationProxies'
import { AvailableProxyModel, ProcurationStatusEnum } from '~/api/Procuration/procuration.model'
import { gridStandardLayout, MuiSpacing, withBottomSpacing } from '~/theme/spacing'
import { sprintf } from 'sprintf-js'
import { formatToFrenchNumberString } from '~/utils/numbers'
import pluralize from '~/components/shared/pluralize/pluralize'

import Loader from '~/ui/Loader'
import { fontWeight } from '~/theme/typography'
import ProxyIntroduction from './Components/ProxyIntroduction'
import ProxyDoneIntroduction from '~/components/Procurations/Components/ProxyTab/Components/ProxyDoneIntroduction'
import { useNavigate } from 'react-router-dom'
import MandatePersonCard, {
  MandatePersonCardType,
} from '~/components/Procurations/Components/MandantTab/Components/MandatePersonCard/MandatePersonCard'
import paths from '~/shared/paths'
import buildExtraData from '~/components/Procurations/Utils/buildExtraData'
import MandateFilters, { IFilters } from '~/components/Procurations/Components/MandateFilters/MandateFilters'
import MandateSkeleton from '~/components/Procurations/Components/MandantTab/Components/MandateSkeleton'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import AGrid from '~/components/AGrid/AGrid'
import { secondsToMilliseconds } from 'date-fns'
import Iconify from '~/mui/iconify'

interface Props {
  done?: boolean
}

export default function ProxyTab({ done }: Props) {
  const [expended, setExpended] = useState(false)
  const [customFilters, setCustomFilers] = useState<IFilters>({
    status: done
      ? [ProcurationStatusEnum.COMPLETED, ProcurationStatusEnum.DUPLICATE, ProcurationStatusEnum.EXCLUDED]
      : [ProcurationStatusEnum.PENDING],
  })
  const debouncedFilters = useDebounce(customFilters, 400)

  const {
    aggregate,
    total,
    isFetchingPreviousPage,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isInitialLoading,
  } = useProcurationProxies({
    params: {
      order: {
        createdAt: 'asc',
      },
      search: debouncedFilters.search,
      zone: debouncedFilters.zone?.uuid,
      status: debouncedFilters.status,
    },
  })

  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: '5px',
  })

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage) {
      fetchNextPage()
    }
  }, [entry?.isIntersecting, fetchNextPage, hasNextPage])

  return (
    <>
      <Grid container {...withBottomSpacing} spacing={MuiSpacing.large}>
        <Grid item {...gridStandardLayout.oneThird}>
          <MandateFilters
            onFilter={value => setCustomFilers(prevState => ({ ...prevState, ...value }))}
            filter={customFilters}
            advanced={done}
          />
          <Grid item>{done ? <ProxyDoneIntroduction /> : <ProxyIntroduction />}</Grid>
        </Grid>

        <Grid item {...gridStandardLayout.twoThirds}>
          {isInitialLoading || (isFetching && !isFetchingNextPage && !isFetchingPreviousPage) ? (
            <MandateSkeleton />
          ) : (
            <>
              <Grid item sx={{ mb: MuiSpacing.large }}>
                <p>
                  <Typography fontWeight={fontWeight.medium}>
                    {sprintf(
                      '%s %s %s',
                      formatToFrenchNumberString(total),
                      pluralize(total, 'Mandataire'),
                      done ? pluralize(total, 'traité') : ''
                    )}
                  </Typography>
                </p>
              </Grid>

              <Grid item sx={{ mb: MuiSpacing.normal }}>
                <Button
                  variant="outlined"
                  onClick={() => setExpended(prevState => !prevState)}
                  fullWidth
                  startIcon={
                    <Iconify
                      icon={expended ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
                      sx={{ mr: 1 }}
                    />
                  }
                >
                  {!expended ? 'Ouvrir tous les volets' : 'Fermer tous les volets'}
                </Button>
              </Grid>

              {isFetchingPreviousPage && (
                <Grid item textAlign={'center'} {...withBottomSpacing}>
                  <Loader />
                </Grid>
              )}

              <AGrid>
                <TransitionGroup component={null}>
                  {aggregate.map(entry => (
                    <CSSTransition timeout={secondsToMilliseconds(1)} key={entry.uuid} classNames="item">
                      <ProxyItem done={done} item={entry} globalExpended={expended} />
                    </CSSTransition>
                  ))}
                </TransitionGroup>
              </AGrid>

              {isFetchingNextPage && (
                <Grid item textAlign={'center'} {...withBottomSpacing}>
                  <Loader />
                </Grid>
              )}

              {/* Intersection observer for infinite scroll, do not remove. */}
              {!isInitialLoading && (
                <div ref={ref} data-cy={'intersection-observer'} data-testid={'intersection-observer'} />
              )}

              {!hasNextPage && aggregate.length > 0 && (
                <div style={{ textAlign: 'center' }}>
                  <Typography color={'text.disabled'} fontSize={12}>
                    Il n’y a pas d’autre résultats.
                  </Typography>
                </div>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </>
  )
}
const ProxyItemComponent = ({
  item,
  globalExpended,
  done = false,
}: {
  item: AvailableProxyModel
  globalExpended: boolean
  done?: boolean
}) => {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)

  return (
    <MandatePersonCard
      history={item.actions}
      hideActions
      uuid={item.uuid}
      firstName={item.first_names}
      lastName={item.last_name}
      status={item.status}
      votePlace={item.vote_place_name}
      location={item.vote_zone?.name}
      peopleInSameVotePlace={!done ? item.available_proxies_count : undefined}
      tags={item.tags ?? []}
      id={item.id}
      expended={globalExpended ? globalExpended : expanded}
      maxProxyCount={item.slots}
      linkedPeople={item.proxy_slots ?? item.request_slots ?? undefined}
      extraInfos={buildExtraData(item)}
      onExpend={() => setExpanded(true)}
      onNarrow={() => setExpanded(false)}
      type={done ? MandatePersonCardType.MATCHED_PROXY : MandatePersonCardType.MATCH_PROXY}
      onSelect={() => navigate(`${paths.procurations}/request/${item.uuid}`)}
      onPersonView={(id, round) => navigate(`${paths.procurations}/request/${id}/${round}/edit`)}
    />
  )
}
const ProxyItem = memo(ProxyItemComponent)
