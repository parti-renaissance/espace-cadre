import { gridStandardLayout, MuiSpacing, withBottomSpacing } from '~/theme/spacing'
import { Grid, Typography } from '@mui/material'
import { Dispatch, memo, SetStateAction, useCallback, useEffect, useState } from 'react'
import MandatePersonCard from '~/components/Mandates/Components/MandantTab/Components/MandatePersonCard'
import { random } from 'lodash'
import { fontWeight } from '~/theme/typography'
import { formatToFrenchNumberString } from '~/utils/numbers'
import useProcurationRequestList from '~/api/Procuration/Hooks/useProcurationRequestList'
import { ProcurationModel } from '~/api/Procuration/procuration.model'
import Loader from '~/ui/Loader'
import { useIntersectionObserver } from '@uidotdev/usehooks'

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
            expended={Boolean(expended[entry.uuid])}
            setExpended={setExpendedHandler}
          ></MandateItem>
        ))}

        {isFetchingNextPage && (
          <Grid item textAlign={'center'} {...withBottomSpacing}>
            <Loader />
          </Grid>
        )}

        {/* Intersection observer for infinite scroll, do not remove. */}
        {!isInitialLoading && <div ref={ref} data-cy={'intersection-observer'} data-testid={'intersection-observer'} />}
      </Grid>
    </Grid>
  )
}

// eslint-disable-next-line react/display-name
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
      peopleInSameVotePlace={random(0, 10)}
      tags={item.tags ?? []}
      id={item.uuid}
      expended={expended}
      extraInfos={[
        {
          key: 'Lorem1',
          value: 'Ipsum',
        },
        {
          key: 'Lorem2',
          value: 'Ipsum',
        },
        {
          key: 'Lorem3',
          value: 'Ipsum',
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
    />
  )
)

// eslint-disable-next-line react/display-name
const MandateIntroduction = memo(() => (
  <div style={{ position: 'sticky', top: 20 }}>
    <p>
      <Typography fontWeight={fontWeight.medium} color={'text.secondary'}>
        Mandants à traiter
      </Typography>{' '}
      <br />
      <Typography color={'text.secondary'} fontSize={14}>
        Pour chacun de ces mandant, vous pouvez voir le nombre de mandataires disponibles dans le même bureau de vote et
        cliquer sur « Trouver un mandataire » pour voir la liste des mandataires disponibles du plus proche au plus
        éloigné.
      </Typography>
    </p>

    <p>
      <Typography color={'text.secondary'} fontSize={14}>
        Veillez à utiliser toutes les informations affichées pour faire les meilleurs choix possible.
      </Typography>
    </p>

    <p>
      <Typography color={'text.secondary'} fontSize={14}>
        Au besoin vous pouvez écarter les mandants qui n’ont plus besoin d’être traités en cliquant sur « Traiter
        manuellement » ou ceux qui vous semblent louche en cliquant sur « Exclure ».
      </Typography>
    </p>
  </div>
))
