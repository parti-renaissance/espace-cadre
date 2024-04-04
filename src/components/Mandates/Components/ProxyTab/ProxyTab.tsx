import { Grid, Typography } from '@mui/material'
import { useIntersectionObserver } from '@uidotdev/usehooks'
import { Dispatch, memo, SetStateAction, useCallback, useEffect, useState } from 'react'
import useProcurationProxies from '~/api/Procuration/Hooks/useProcurationProxies'
import { AvailableProxyModel, ProcurationStatusEnum } from '~/api/Procuration/procuration.model'
import { gridStandardLayout, MuiSpacing, withBottomSpacing } from '~/theme/spacing'
import MandateSkeleton from '../MandantTab/Components/MandateSkeleton'
import { sprintf } from 'sprintf-js'
import { formatToFrenchNumberString } from '~/utils/numbers'
import pluralize from '~/components/shared/pluralize/pluralize'

import Loader from '~/ui/Loader'
import { fontWeight } from '~/theme/typography'
import ProxyIntroduction from './Components/ProxyIntroduction'
import ProxyDoneIntroduction from '~/components/Mandates/Components/ProxyTab/Components/ProxyDoneIntroduction'
import { useNavigate } from 'react-router-dom'
import MandatePersonCard, {
  MandatePersonCardType,
} from '~/components/Mandates/Components/MandantTab/Components/MandatePersonCard'
import paths from '~/shared/paths'
import buildExtraData from '~/components/Mandates/Utils/buildExtraData'
import MandateFilters from '~/components/Mandates/Components/MandateFilters/MandateFilters'

interface Props {
  done?: boolean
}

export default function ProxyTab({ done }: Props) {
  const [expended, setExpended] = useState<Record<string, boolean>>({})
  const [customFilters, setCustomFilers] = useState<Record<string, string>>({})

  const { aggregate, total, isFetchingPreviousPage, isFetchingNextPage, hasNextPage, fetchNextPage, isInitialLoading } =
    useProcurationProxies({
      params: {
        order: {
          createdAt: 'asc',
        },
        status: done ? ProcurationStatusEnum.COMPLETED : ProcurationStatusEnum.PENDING,
        ...customFilters,
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

  const setExpendedHandler = useCallback((el: SetStateAction<Record<string, boolean>>) => {
    setExpended(el)
  }, [])

  const onToggleMore = useCallback(
    (newState: boolean) => {
      setExpended(
        aggregate
          ? aggregate.reduce(
              (prev, curr) => ({
                ...prev,
                [curr.id]: newState,
              }),
              {}
            )
          : {}
      )
    },
    [aggregate]
  )

  return (
    <>
      <Grid container {...withBottomSpacing} spacing={MuiSpacing.large}>
        <Grid item {...gridStandardLayout.oneThird}>
          {done ? <ProxyDoneIntroduction /> : <ProxyIntroduction />}
        </Grid>

        <Grid item {...gridStandardLayout.twoThirds}>
          <Grid item xs sx={{ mb: MuiSpacing.normal }}>
            <MandateFilters onFilter={setCustomFilers} onToggleMore={onToggleMore} isProxy />
          </Grid>

          {isInitialLoading ? (
            <MandateSkeleton />
          ) : (
            <>
              <Grid item sx={{ mb: MuiSpacing.large }}>
                <p>
                  <Typography fontWeight={fontWeight.medium}>
                    {sprintf(
                      '%i %s %s',
                      formatToFrenchNumberString(total),
                      pluralize(total, 'Mandataire'),
                      done ? pluralize(total, 'traité') : ''
                    )}
                  </Typography>
                </p>
              </Grid>

              {isFetchingPreviousPage && (
                <Grid item textAlign={'center'} {...withBottomSpacing}>
                  <Loader />
                </Grid>
              )}

              {aggregate.map(entry => (
                <ProxyItem
                  done={done}
                  key={entry.uuid}
                  item={entry}
                  expended={Boolean(expended[entry.id])}
                  setExpended={setExpendedHandler}
                />
              ))}

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
  expended,
  setExpended,
  done = false,
}: {
  item: AvailableProxyModel
  expended: boolean
  setExpended: Dispatch<SetStateAction<Record<string, boolean>>>
  done?: boolean
}) => {
  const navigate = useNavigate()

  return (
    <MandatePersonCard
      hideActions
      uuid={item.uuid}
      firstName={item.first_names}
      lastName={item.last_name}
      votePlace={item.vote_place_name}
      location={item.vote_zone?.name}
      peopleInSameVotePlace={!done ? item.available_proxies_count : undefined}
      tags={item.tags ?? []}
      id={item.id}
      expended={expended}
      resourceId={item.uuid}
      maxProxyCount={item.slots}
      linkedPeople={
        item.requests
          ? item.requests.map(request => ({
              id: request.uuid,
              firstName: request.first_names,
              lastName: request.last_name,
              gender: request.gender,
            }))
          : undefined
      }
      extraInfos={buildExtraData(item)}
      onExpend={id =>
        setExpended(v => ({
          ...v,
          [id]: true,
        }))
      }
      onNarrow={id =>
        setExpended(v => ({
          ...v,
          [id]: false,
        }))
      }
      type={done ? MandatePersonCardType.MATCHED_PROXY : MandatePersonCardType.MATCH_PROXY}
      hideStateActions={done}
      onSelect={() => navigate(`${paths.procurations}/request/${item.uuid}`)}
      onPersonView={id =>
        navigate(`${paths.procurations}/request/${id}/edit`, {
          state: {
            proxy: item,
          },
        })
      }
    />
  )
}
const ProxyItem = memo(ProxyItemComponent)
