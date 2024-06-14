import { Grid, Typography } from '@mui/material'
import { useDebounce, useIntersectionObserver } from '@uidotdev/usehooks'
import { Dispatch, memo, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSessionStorage } from 'react-use'
import { sprintf } from 'sprintf-js'
import useProcurationRequestList from '~/api/Procuration/Hooks/useProcurationRequestList'
import { ProcurationModel, ProcurationStatusEnum } from '~/api/Procuration/procuration.model'
import MandateDoneIntroduction from '~/components/Procurations/Components/MandantTab/Components/MandateDoneIntroduction'
import MandateIntroduction from '~/components/Procurations/Components/MandantTab/Components/MandateIntroduction'
import pluralize from '~/components/shared/pluralize/pluralize'
import { formatDate } from '~/shared/helpers'
import paths from '~/shared/paths'
import { gridStandardLayout, MuiSpacing, withBottomSpacing } from '~/theme/spacing'
import { fontWeight } from '~/theme/typography'
import Loader from '~/ui/Loader'
import { buildAddress } from '~/utils/address'
import { dateFormat } from '~/utils/date'
import { formatToFrenchNumberString } from '~/utils/numbers'
import MandateFilters from '~/components/Procurations/Components/MandateFilters/MandateFilters'
import MandatePersonCard, {
  MandatePersonCardType,
} from '~/components/Procurations/Components/MandantTab/Components/MandatePersonCard/MandatePersonCard'
import MandateSkeleton from './Components/MandateSkeleton'
import MandateSuccessModal from '~/components/Procurations/Components/MandateSuccessModal/MandateSuccessModal'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { secondsToMilliseconds } from 'date-fns'
import AGrid from '~/components/AGrid/AGrid'

interface Props {
  // Switch to "Mandants traités" render
  done?: boolean
}

export default function MandantTab({ done = false }: Props) {
  const [expended, setExpended] = useState<Record<string, boolean>>({})
  const [customFilters, setCustomFilers] = useState<Record<string, string>>({})
  const debouncedFilters = useDebounce(customFilters, 400)

  const { aggregate, total, isFetchingPreviousPage, isFetchingNextPage, hasNextPage, fetchNextPage, isInitialLoading } =
    useProcurationRequestList({
      order: {
        createdAt: 'asc',
      },
      status: done ? ProcurationStatusEnum.COMPLETED : ProcurationStatusEnum.PENDING,
      ...debouncedFilters,
    })

  const [procurationSuccessFlash, setProcurationSuccessFlash] = useSessionStorage<
    { mandate: string; proxy: string } | false
  >('procurationSuccessFlash', false)
  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: '5px',
  })

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

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage) {
      fetchNextPage()
    }
  }, [entry?.isIntersecting, fetchNextPage, hasNextPage])

  const setExpendedHandler = useCallback((el: SetStateAction<Record<string, boolean>>) => {
    setExpended(el)
  }, [])

  const onCloseModal = useCallback(() => {
    setProcurationSuccessFlash(false)
  }, [setProcurationSuccessFlash])

  return (
    <>
      <Grid container {...withBottomSpacing} spacing={MuiSpacing.large}>
        <Grid item {...gridStandardLayout.oneThird}>
          {done ? <MandateDoneIntroduction /> : <MandateIntroduction />}
        </Grid>

        <Grid item {...gridStandardLayout.twoThirds}>
          <Grid item xs sx={{ mb: MuiSpacing.normal }}>
            <MandateFilters
              onFilter={setCustomFilers}
              status={done ? ProcurationStatusEnum.COMPLETED : ProcurationStatusEnum.PENDING}
              onToggleMore={onToggleMore}
            />
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
                      pluralize(total, 'Mandant'),
                      done ? pluralize(total, 'Traité') : ''
                    )}
                  </Typography>
                </p>
              </Grid>

              {isFetchingPreviousPage && (
                <Grid item textAlign={'center'} {...withBottomSpacing}>
                  <Loader />
                </Grid>
              )}

              <AGrid>
                <TransitionGroup component={null}>
                  {aggregate.map(entry => (
                    <CSSTransition timeout={secondsToMilliseconds(1)} classNames="item" key={entry.uuid}>
                      <MandateItem
                        done={done}
                        item={entry}
                        expended={Boolean(expended[entry.id])}
                        setExpended={setExpendedHandler}
                      />
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

      {procurationSuccessFlash && !done && (
        <MandateSuccessModal
          mandate={procurationSuccessFlash.mandate}
          proxy={procurationSuccessFlash.proxy}
          onClose={onCloseModal}
        />
      )}
    </>
  )
}

const MandateItemComponent = ({
  item,
  expended,
  setExpended,
  done = false,
}: {
  item: ProcurationModel
  expended: boolean
  setExpended: Dispatch<SetStateAction<Record<string, boolean>>>
  done?: boolean
}) => {
  const navigate = useNavigate()

  return (
    <MandatePersonCard
      hideActions={done}
      uuid={item.uuid}
      firstName={item.first_names}
      lastName={item.last_name}
      votePlace={item.vote_place_name}
      location={item.vote_zone?.name}
      peopleInSameVotePlace={!done ? item.available_proxies_count : undefined}
      tags={item.tags ?? []}
      id={item.id}
      expended={expended}
      linkedPeople={item.proxy_slots ?? item.request_slots ?? undefined}
      extraInfos={[
        {
          key: 'Âge',
          value: `${item.age} ans`,
        },
        {
          key: 'Adresse postale',
          value: buildAddress(item.post_address),
        },
        {
          key: 'Date d’inscription',
          value: formatDate(item.created_at, dateFormat),
        },
      ]}
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
      type={done ? MandatePersonCardType.MATCHED_MANDANT : MandatePersonCardType.FIND}
      hideStateActions={done}
      onSelect={round => navigate(`${paths.procurations}/request/${item.uuid}/${round}`)}
      onPersonView={
        done ? (id, round) => navigate(`${paths.procurations}/request/${item.uuid}/${round}/edit`) : undefined
      }
      inFrenchSoil={item.from_france}
    />
  )
}
const MandateItem = memo(MandateItemComponent)
