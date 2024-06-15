import { useParams } from 'react-router'
import Page from '~/components/Page/Page'
import { Grid, Typography } from '@mui/material'
import { gridStandardLayout, MuiSpacing, withBottomSpacing } from '~/theme/spacing'
import useProcurationRequest from '~/api/Procuration/Hooks/useProcurationRequest'
import MandatePersonCard, {
  MandatePersonCardType,
} from '~/components/Procurations/Components/MandantTab/Components/MandatePersonCard/MandatePersonCard'
import { Fragment, memo, useCallback, useEffect, useState } from 'react'
import { AvailableProxyModel, MatchingLevelEnum, ProcurationDetailsModel } from '~/api/Procuration/procuration.model'
import MandateMatchPageSkeleton from '~/components/Procurations/Components/Skeleton/MandateMatchPageSkeleton'
import { fontWeight } from '~/theme/typography'
import Divider from '@mui/material/Divider'
import { grey } from '~/theme/palette'
import useProcurationAvailableProxies from '~/api/Procuration/Hooks/useProcurationAvailableProxies'
import { useIntersectionObserver } from '@uidotdev/usehooks'
import { useNavigate } from 'react-router-dom'
import paths from '~/shared/paths'
import buildExtraData from '~/components/Procurations/Utils/buildExtraData'

export default function MandateMatchPage() {
  const params = useParams()
  const navigate = useNavigate()

  const { isError: procurationError, data, isLoading } = useProcurationRequest({ uuid: params.id })
  const { aggregate, hasNextPage, fetchNextPage, isInitialLoading } = useProcurationAvailableProxies({
    uuid: params.id,
    params: { round: params.round },
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

  const [expended, setExpended] = useState<Record<string, boolean>>({})

  const onSelect = useCallback(
    (proxy: AvailableProxyModel) => () => {
      if (!params.id) {
        return
      }

      navigate(`${paths.procurations}/request/${params.id}/${params.round}/link`, {
        state: {
          proxy,
        },
      })
    },
    [navigate, params.id, params.round]
  )

  const setExpendedMemo = useCallback(
    (id: string) =>
      setExpended(v => ({
        ...v,
        [id]: !v[id],
      })),
    []
  )

  if (isLoading) {
    return <MandateMatchPageSkeleton />
  }

  if (!data || procurationError) {
    return (
      <Page backButton>
        <Grid container justifyContent={'center'}>
          <Typography>Impossible de trouver cette demande.</Typography>
        </Grid>
      </Page>
    )
  }

  return (
    <Page backButton>
      <Grid container {...withBottomSpacing} spacing={MuiSpacing.large}>
        <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' }, my: MuiSpacing.normal }}>
          <Typography fontWeight={fontWeight.medium} fontSize={18}>
            Mandant à lier
          </Typography>

          <Divider sx={{ borderBottom: 'dashed 1px', borderBottomColor: grey[300], pt: MuiSpacing.normal }} />
        </Grid>

        <Grid item {...gridStandardLayout.oneThird}>
          <div style={{ position: 'sticky', top: 72 }}>
            <Grid item sx={{ display: { xs: 'none', md: 'block' }, my: MuiSpacing.normal }}>
              <Typography fontSize={18} fontWeight={fontWeight.medium}>
                Mandant
              </Typography>
            </Grid>

            <MandateInfo {...data} />
          </div>
        </Grid>

        <Grid item {...gridStandardLayout.twoThirds}>
          <Grid item textAlign={'center'} sx={{ display: { xs: 'none', md: 'block' }, my: MuiSpacing.normal }}>
            <Typography textAlign={'center'} fontSize={18} fontWeight={fontWeight.medium}>
              Mandataires
            </Typography>
          </Grid>

          {aggregate?.map((el, index) => (
            <Fragment key={el.uuid}>
              {el.matching_level && (index === 0 || el.matching_level !== aggregate[index - 1].matching_level) && (
                <Grid item {...withBottomSpacing}>
                  <Typography color={'success.main'} fontSize={14}>
                    {getSectionName(el.matching_level)}
                  </Typography>
                </Grid>
              )}

              <Proxy expended={expended[el.id]} setExpended={setExpendedMemo} el={el} onSelect={onSelect(el)} />
            </Fragment>
          ))}

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
        </Grid>
      </Grid>
    </Page>
  )
}

const getSectionName = (type: MatchingLevelEnum) => {
  switch (type) {
    case MatchingLevelEnum.VOTE_PLACE:
      return 'Même bureau de vote'
    case MatchingLevelEnum.BOROUGH:
      return 'Même arrondissement'
    case MatchingLevelEnum.CITY:
      return 'Même commune'
    case MatchingLevelEnum.DEPARTMENT:
      return 'Même département'
    case MatchingLevelEnum.COUNTRY:
      return 'Même pays'
  }
}

const MandateInfo = memo((data: ProcurationDetailsModel) => (
  <MandatePersonCard
    firstName={data.first_names}
    lastName={data.last_name}
    id={data.id}
    location={data.vote_zone.name}
    tags={data.tags ?? []}
    votePlace={data.vote_place_name}
    type={MandatePersonCardType.MATCH_MANDANT}
    extraInfos={buildExtraData(data)}
    expended
    hideStateActions
    inFrenchSoil={data.from_france}
  />
))
MandateInfo.displayName = 'MandateInfo'

const Proxy = memo(
  ({
    el,
    setExpended,
    expended,
    onSelect,
  }: {
    el: AvailableProxyModel
    setExpended: (id: string) => void
    onSelect: () => void
    expended: boolean
  }) => (
    <MandatePersonCard
      key={el.uuid}
      firstName={el.first_names}
      lastName={el?.last_name}
      id={el.id}
      location={el.vote_zone.name}
      tags={el.tags ?? []}
      votePlace={el.vote_place_name}
      type={MandatePersonCardType.MATCH_PROXY}
      extraInfos={buildExtraData(el)}
      onExpend={setExpended}
      onNarrow={setExpended}
      expended={expended}
      maxProxyCount={el.slots}
      onSelect={onSelect}
      linkedPeople={el.request_slots ?? undefined}
      uuid={el.uuid}
    />
  )
)
Proxy.displayName = 'Proxy'
