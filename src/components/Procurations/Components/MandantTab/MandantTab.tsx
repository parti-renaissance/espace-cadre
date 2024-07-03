import { Button, Grid, Typography } from '@mui/material'
import { useDebounce, useIntersectionObserver } from '@uidotdev/usehooks'
import { memo, useCallback, useEffect, useState } from 'react'
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
import MandateFilters, { IFilters } from '~/components/Procurations/Components/MandateFilters/MandateFilters'
import MandatePersonCard, {
  MandatePersonCardType,
} from '~/components/Procurations/Components/MandantTab/Components/MandatePersonCard/MandatePersonCard'
import MandateSkeleton from './Components/MandateSkeleton'
import MandateSuccessModal from '~/components/Procurations/Components/MandateSuccessModal/MandateSuccessModal'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { secondsToMilliseconds } from 'date-fns'
import AGrid from '~/components/AGrid/AGrid'
import Iconify from '~/mui/iconify'

interface Props {
  // Switch to "Mandants traités" render
  done?: boolean
}

export default function MandantTab({ done = false }: Props) {
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
  } = useProcurationRequestList({
    order: {
      createdAt: 'asc',
    },
    search: debouncedFilters.search,
    zone: debouncedFilters.zone?.uuid,
    status: debouncedFilters.status,
  })

  const [procurationSuccessFlash, setProcurationSuccessFlash] = useSessionStorage<
    { mandate: string; proxy: string } | false
  >('procurationSuccessFlash', false)
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

  const onCloseModal = useCallback(() => {
    setProcurationSuccessFlash(false)
  }, [setProcurationSuccessFlash])

  return (
    <>
      <Grid container {...withBottomSpacing} spacing={MuiSpacing.large}>
        <Grid item {...gridStandardLayout.oneThird}>
          <MandateFilters
            onFilter={value => setCustomFilers(prevState => ({ ...prevState, ...value }))}
            filter={customFilters}
            advanced={done}
          />
          <Grid item>{done ? <MandateDoneIntroduction /> : <MandateIntroduction />}</Grid>
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
                      pluralize(total, 'Mandant'),
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
                    <CSSTransition timeout={secondsToMilliseconds(1)} classNames="item" key={entry.uuid}>
                      <MandateItem done={done} item={entry} globalExpended={expended} />
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
  globalExpended,
  done = false,
}: {
  item: ProcurationModel
  globalExpended: boolean
  done?: boolean
}) => {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)

  return (
    <MandatePersonCard
      history={item.actions}
      hideActions={done}
      uuid={item.uuid}
      status={item.status}
      firstName={item.first_names}
      lastName={item.last_name}
      votePlace={item.vote_place_name}
      district={item.district}
      acceptVoteNearby={item.accept_vote_nearby}
      location={item.vote_zone?.name}
      peopleInSameVotePlace={!done ? item.available_proxies_count : undefined}
      tags={item.tags ?? []}
      id={item.id}
      expended={globalExpended ? globalExpended : expanded}
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
      onExpend={() => setExpanded(true)}
      onNarrow={() => setExpanded(false)}
      type={done ? MandatePersonCardType.MATCHED_MANDANT : MandatePersonCardType.FIND}
      onSelect={round => navigate(`${paths.procurations}/request/${item.uuid}/${round}`)}
      onPersonView={(id, round) => navigate(`${paths.procurations}/request/${item.uuid}/${round}/edit`)}
      inFrenchSoil={item.from_france}
    />
  )
}
const MandateItem = memo(MandateItemComponent)
