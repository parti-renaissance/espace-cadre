import { useParams } from 'react-router'
import Page from '~/components/Page/Page'
import { Grid, Typography } from '@mui/material'
import { gridStandardLayout, MuiSpacing, withBottomSpacing } from '~/theme/spacing'
import useProcurationRequest from '~/api/Procuration/Hooks/useProcurationRequest'
import MandatePersonCard, {
  MandatePersonCardType,
} from '~/components/Mandates/Components/MandantTab/Components/MandatePersonCard'
import { memo, useCallback, useEffect, useState } from 'react'
import { parseISO } from 'date-fns'
import { getFormattedDate } from '~/utils/date'
import {
  AvailableProxyModel,
  MatchingLevelEnum,
  ProcurationModelWithPersonalInfos,
} from '~/api/Procuration/procuration.model'
import MandateMatchPageSkeleton from '~/components/Mandates/Components/Skeleton/MandateMatchPageSkeleton'
import { fontWeight } from '~/theme/typography'
import Divider from '@mui/material/Divider'
import { grey } from '~/theme/palette'
import useProcurationAvailableProxies from '~/api/Procuration/Hooks/useProcurationAvailableProxies'
import { useIntersectionObserver } from '@uidotdev/usehooks'
import useProcurationMatch from '~/api/Procuration/Hooks/useProcurationMatch'
import { useNavigate } from 'react-router-dom'
import paths from '~/shared/paths'

export default function MandateMatchPage() {
  const params = useParams()
  const navigate = useNavigate()

  const { mutateAsync, isLoading: isMatching } = useProcurationMatch()
  const { isError: procurationError, data, isLoading } = useProcurationRequest({ uuid: params.id })
  const { aggregate, hasNextPage, fetchNextPage, isInitialLoading } = useProcurationAvailableProxies({
    uuid: params.id,
    params: {},
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
    (proxyUuid: string) => () => {
      if (!params.id) {
        return
      }

      mutateAsync({
        uuid: params.id,
        proxy: proxyUuid,
      }).then(() => {
        navigate(paths.procurations)
      })
    },
    [mutateAsync, navigate, params.id]
  )

  const setExpendedMemo = useCallback(
    (id: string) =>
      setExpended(v => ({
        ...v,
        [id]: v[id] ? !v[id] : true,
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
            <>
              {el.matching_level && (index === 0 || el.matching_level !== aggregate[index - 1].matching_level) && (
                <Grid item {...withBottomSpacing}>
                  <Typography color={'success.main'} fontSize={14}>
                    {getSectionName(el.matching_level)}
                  </Typography>
                </Grid>
              )}

              <Proxy
                key={el.id}
                expended={expended[el.id]}
                setExpended={setExpendedMemo}
                el={el}
                onSelect={onSelect(el.uuid)}
                isProcessing={isMatching}
              />
            </>
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
    case MatchingLevelEnum.CITY:
      return 'Même commune'
    case MatchingLevelEnum.COUNTRY:
      return 'Même pays'
    case MatchingLevelEnum.VOTE_PLACE:
      return 'Même bureau de vote'
  }
}

const MandateInfo = memo((data: ProcurationModelWithPersonalInfos) => (
  <MandatePersonCard
    firstName={data.first_names}
    lastName={data?.last_name}
    id={data.id}
    location={data.vote_zone.name}
    tags={[]}
    votePlace={data.vote_place_name}
    type={MandatePersonCardType.MATCH_MANDANT}
    extraInfos={[
      {
        key: 'Age',
        value: `${data.age} ans`,
      },
      {
        key: 'Mail',
        value: data.email,
      },
      {
        key: 'Téléphone',
        value: data.phone ?? 'Pas de téléphone',
      },
      {
        key: 'Adresse postale',
        value: `${data.post_address.address}, ${data.post_address.postal_code} ${data.post_address.city_name}`,
      },
      {
        key: 'Date d’inscription',
        value: getFormattedDate(parseISO(data.created_at)),
      },
    ]}
    expended
  />
))
MandateInfo.displayName = 'MandateInfo'

const Proxy = memo(
  ({
    el,
    setExpended,
    expended,
    onSelect,
    isProcessing,
  }: {
    el: AvailableProxyModel
    setExpended: (id: string) => void
    expended: boolean
    onSelect: () => void
    isProcessing: boolean
  }) => (
    <MandatePersonCard
      key={el.uuid}
      firstName={el.first_names}
      lastName={el?.last_name}
      id={el.id}
      location={el.vote_zone.name}
      tags={[]}
      votePlace={el.vote_place_name}
      type={MandatePersonCardType.MATCH_PROXY}
      extraInfos={[]}
      onExpend={setExpended}
      onNarrow={setExpended}
      expended={expended[el.id]}
      maxProxyCount={2}
      linkedPeople={el.requests?.map(req => ({
        id: req.id,
        firstName: req.first_names,
        lastName: req.last_name,
        gender: req.gender,
      }))}
      onSelect={onSelect}
      isProcessing={isProcessing}
    />
  )
)
Proxy.displayName = 'Proxy'
