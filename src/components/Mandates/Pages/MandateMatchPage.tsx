import { useParams } from 'react-router'
import Page from '~/components/Page/Page'
import { Grid, Typography } from '@mui/material'
import { gridStandardLayout, MuiSpacing, withBottomSpacing } from '~/theme/spacing'
import useProcurationRequest from '~/api/Procuration/Hooks/useProcurationRequest'
import MandatePersonCard, {
  MandatePersonCardType,
} from '~/components/Mandates/Components/MandantTab/Components/MandatePersonCard'
import { memo, useState } from 'react'
import { parseISO } from 'date-fns'
import { getFormattedDate } from '~/utils/date'
import { ProcurationModelWithPersonalInfos } from '~/api/Procuration/procuration.model'
import { GenderEnum } from '~/models/common.model'
import MandateMatchPageSkeleton from '~/components/Mandates/Components/Skeleton/MandateMatchPageSkeleton'
import { fontWeight } from '~/theme/typography'
import Divider from '@mui/material/Divider'
import { grey } from '~/theme/palette'

export default function MandateMatchPage() {
  const params = useParams()

  const { isError, data, isLoading } = useProcurationRequest({ id: params.id })

  const [expended, setExpended] = useState<Record<string, boolean>>({})

  if (isLoading) {
    return <MandateMatchPageSkeleton />
  }

  if (!data || isError) {
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

          <Grid item {...withBottomSpacing}>
            <Typography color={'success.main'} fontSize={14}>
              Même bureau de vote (1)
            </Typography>
          </Grid>

          <MandatePersonCard
            firstName={data.first_names}
            lastName={data?.last_name}
            id={data.id}
            location={data.vote_zone.name}
            tags={[]}
            votePlace={data.vote_place_name}
            type={MandatePersonCardType.MATCH_PROXY}
            extraInfos={[
              {
                key: 'Lorem',
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
            expended={expended[data.id]}
            maxProxyCount={2}
            linkedPeople={[
              {
                firstName: 'Gufta',
                lastName: 'Papa',
                id: 'uuid',
                gender: GenderEnum.FEMALE,
                avatar: 'https://avatars2.githubusercontent.com/u/55?v=4',
              },
              {
                firstName: 'Gufta',
                lastName: 'Papa2',
                id: 'uuid2',
                gender: GenderEnum.FEMALE,
                avatar: 'https://avatars2.githubusercontent.com/u/55?v=4',
              },
            ]}
          />
          <MandatePersonCard
            firstName={data.first_names}
            lastName={data?.last_name}
            id={data.id}
            location={data.vote_zone.name}
            tags={[]}
            votePlace={data.vote_place_name}
            type={MandatePersonCardType.MATCH_PROXY}
            extraInfos={[
              {
                key: 'Lorem',
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
            expended={expended[data.id]}
            maxProxyCount={2}
            linkedPeople={[
              {
                firstName: 'Gufta',
                lastName: 'Papa',
                id: 'uuid',
                gender: GenderEnum.FEMALE,
                avatar: 'https://avatars2.githubusercontent.com/u/55?v=4',
              },
              {
                firstName: 'Gufta',
                lastName: 'Papa2',
                id: 'uuid2',
                gender: GenderEnum.FEMALE,
                avatar: 'https://avatars2.githubusercontent.com/u/55?v=4',
              },
            ]}
          />
          <MandatePersonCard
            firstName={data.first_names}
            lastName={data?.last_name}
            id={data.id}
            location={data.vote_zone.name}
            tags={[]}
            votePlace={data.vote_place_name}
            type={MandatePersonCardType.MATCH_PROXY}
            extraInfos={[
              {
                key: 'Lorem',
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
            expended={expended[data.id]}
            maxProxyCount={2}
            linkedPeople={[
              {
                firstName: 'Gufta',
                lastName: 'Papa',
                id: 'uuid',
                gender: GenderEnum.FEMALE,
                avatar: 'https://avatars2.githubusercontent.com/u/55?v=4',
              },
              {
                firstName: 'Gufta',
                lastName: 'Papa2',
                id: 'uuid2',
                gender: GenderEnum.FEMALE,
                avatar: 'https://avatars2.githubusercontent.com/u/55?v=4',
              },
            ]}
          />
        </Grid>
      </Grid>
    </Page>
  )
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
