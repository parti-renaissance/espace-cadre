import Page from '~/components/Page/Page'
import { MuiSpacing } from '~/theme/spacing'
import { Button, Grid, Paper, Typography } from '@mui/material'
import useProcurationRequest from '~/api/Procuration/Hooks/useProcurationRequest'
import { useParams } from 'react-router'
import SkeletonCard from '~/components/Skeleton/SkeletonCard'
import MandatePersonCard, {
  MandatePersonCardType,
} from '~/components/Mandates/Components/MandantTab/Components/MandatePersonCard'
import Divider from '@mui/material/Divider'
import { fontWeight } from '~/theme/typography'
import { useLocation, useNavigate } from 'react-router-dom'
import paths from '~/shared/paths'
import { isAxiosError } from 'axios'
import { closeSnackbar, enqueueSnackbar } from 'notistack'
import buildExtraData from '~/components/Mandates/Utils/buildExtraData'
import { useCallback } from 'react'
import DottedCard from '~/components/DottedCard/DottedCard'
import useProcurationUnmatch from '~/api/Procuration/Hooks/useProcurationUnmatch'
import { AvailableProxyModel } from '~/api/Procuration/procuration.model'
import useGardEmptyState from '~/hooks/useGardEmptyState'
import { getFormattedDate } from '~/utils/date'

export default function MandateEditPage() {
  const params = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  useGardEmptyState()

  const { data } = useProcurationRequest({ uuid: params.id })
  const { mutateAsync, isLoading: isUnmatching } = useProcurationUnmatch()

  const proxy: AvailableProxyModel | undefined = state.proxy

  if (!proxy) {
    navigate(-1)
    return
  }

  const onUnmatch = useCallback(() => {
    const { id } = params

    if (!id || !proxy) {
      return
    }

    mutateAsync({
      uuid: id,
      proxy: proxy.uuid,
    })
      .then(() => {
        navigate(paths.procurations)
      })
      .catch((error: Error) => {
        if (isAxiosError(error)) {
          enqueueSnackbar(error.response?.data.message, {
            variant: 'error',
            action: () => (
              <Button
                onClick={() => {
                  closeSnackbar()
                  navigate(-1)
                }}
              >
                Retour
              </Button>
            ),
          })
        }
      })
  }, [mutateAsync, navigate, params, proxy])

  return (
    <Page backButton>
      <DottedCard>
        <Grid container spacing={MuiSpacing.normal}>
          <Grid item xs={12} mb={MuiSpacing.normal}>
            <Paper sx={{ p: MuiSpacing.normal }}>
              <Grid container>
                <Typography fontSize={14} mb={MuiSpacing.normal}>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea fugit illum labore numquam quia
                  recusandae. Doloremque exercitationem expedita facere fuga incidunt iste laboriosam soluta totam
                  veritatis voluptate! Optio quia, sapiente!
                </Typography>

                <Grid item mb={MuiSpacing.normal} xs={12}>
                  <Divider />
                </Grid>

                <Grid container sx={{ mb: MuiSpacing.small }} spacing={MuiSpacing.normal}>
                  <InfoLine label={'Bureau de vote'} value={data?.vote_place_name}></InfoLine>
                  <InfoLine
                    label={'Date du match'}
                    value={data?.created_at ? getFormattedDate(data?.created_at) : ''}
                    color={'text.primary'}
                  ></InfoLine>
                  <InfoLine label={'Auteur'} value={''} color={'text.primary'}></InfoLine>
                </Grid>

                <Grid item xs={12} textAlign={'right'}>
                  <Button variant={'outlined'} disabled={isUnmatching} onClick={onUnmatch}>
                    Dissocier
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={12} md={6}>
            {data ? (
              <MandatePersonCard
                firstName={data.first_names}
                lastName={data?.last_name}
                id={data.id}
                location={data.vote_zone.name}
                tags={[]}
                votePlace={data.vote_place_name}
                type={MandatePersonCardType.MATCH_MANDANT}
                extraInfos={buildExtraData(data)}
                expended
              />
            ) : (
              <SkeletonCard />
            )}
          </Grid>

          <Grid item xs={12} sm={12} md={6}>
            <MandatePersonCard
              firstName={proxy.first_names}
              lastName={proxy.last_name}
              id={proxy.id}
              location={proxy.vote_zone.name}
              tags={[]}
              votePlace={proxy.vote_place_name}
              type={MandatePersonCardType.MATCH_PROXY}
              extraInfos={buildExtraData(proxy)}
              expended
              hideActions
            />
          </Grid>
        </Grid>
      </DottedCard>
    </Page>
  )
}

const InfoLine = ({ label, value, color }: { label: string; color?: string; value?: string }) => (
  <>
    <Grid item xs={4} sm={3}>
      <Typography fontWeight={fontWeight.medium} color={'text.secondary'} fontSize={12}>
        {label}
      </Typography>
    </Grid>
    <Grid item xs={8} sm={9}>
      <Typography fontSize={14} color={color ?? 'success.main'}>
        {value}
      </Typography>
    </Grid>
  </>
)
