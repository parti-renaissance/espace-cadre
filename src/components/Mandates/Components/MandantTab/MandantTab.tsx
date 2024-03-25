import { gridStandardLayout, MuiSpacing, withBottomSpacing } from '~/theme/spacing'
import { Grid, Typography } from '@mui/material'
import { Dispatch, memo, SetStateAction, useCallback, useEffect, useState } from 'react'
import MandatePersonCard, {
  MandatePersonCardType,
} from '~/components/Mandates/Components/MandantTab/Components/MandatePersonCard'
import { fontWeight } from '~/theme/typography'
import { formatToFrenchNumberString } from '~/utils/numbers'
import useProcurationRequestList from '~/api/Procuration/Hooks/useProcurationRequestList'
import { ProcurationModel } from '~/api/Procuration/procuration.model'
import Loader from '~/ui/Loader'
import { useIntersectionObserver } from '@uidotdev/usehooks'
import MandateIntroduction from '~/components/Mandates/Components/MandantTab/Components/MandateIntroduction'
import MandateSkeleton from '~/components/Mandates/Components/MandantTab/Components/MandateSkeleton'
import { buildAddress } from '~/utils/address'
import { formatDate } from '~/shared/helpers'
import { dateFormat } from '~/utils/date'

export default function MandantTab() {
  const { aggregate, total, isFetchingPreviousPage, isFetchingNextPage, hasNextPage, fetchNextPage, isInitialLoading } =
    useProcurationRequestList({
      order: {
        createdAt: 'asc',
      },
    })

  const [expended, setExpended] = useState<Record<string, boolean>>({})

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

  return (
    <Grid container {...withBottomSpacing} spacing={MuiSpacing.large}>
      <Grid item {...gridStandardLayout.oneThird}>
        <MandateIntroduction />
      </Grid>

      <Grid item {...gridStandardLayout.twoThirds}>
        {isInitialLoading ? (
          <MandateSkeleton />
        ) : (
          <>
            <Grid item sx={{ mb: MuiSpacing.large }}>
              <p>
                <Typography fontWeight={fontWeight.medium}>{formatToFrenchNumberString(total)} Mandants</Typography>
              </p>
            </Grid>

            {isFetchingPreviousPage && (
              <Grid item textAlign={'center'} {...withBottomSpacing}>
                <Loader />
              </Grid>
            )}

            {aggregate.map(entry => (
              <MandateItem
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
  )
}

const MandateItem = memo(
  ({
    item,
    expended,
    setExpended,
  }: {
    item: ProcurationModel
    expended: boolean
    setExpended: Dispatch<SetStateAction<Record<string, boolean>>>
  }) => (
    <MandatePersonCard
      firstName={item.first_names}
      lastName={item.last_name}
      votePlace={item.vote_place_name}
      location={item.vote_zone?.name}
      peopleInSameVotePlace={item.available_proxies_count}
      tags={item.tags ?? []}
      id={item.id}
      expended={expended}
      demandId={item.uuid}
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
      type={MandatePersonCardType.FIND}
    />
  )
)
MandateItem.displayName = 'MandateItem'
