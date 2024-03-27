import Page from '~/components/Page/Page'
import styled from '@emotion/styled'
import { CssSpacing, MuiSpacing } from '~/theme/spacing'
import { grey, other } from '~/theme/palette'
import { Button, Grid, List, ListItem, Paper, Typography } from '@mui/material'
import useProcurationRequest from '~/api/Procuration/Hooks/useProcurationRequest'
import { useParams } from 'react-router'
import SkeletonCard from '~/components/Skeleton/SkeletonCard'
import MandatePersonCard, {
  MandatePersonCardType,
} from '~/components/Mandates/Components/MandantTab/Components/MandatePersonCard'
import Divider from '@mui/material/Divider'
import { fontWeight } from '~/theme/typography'
import useProcurationMatch from '~/api/Procuration/Hooks/useProcurationMatch'
import { useLocation, useNavigate } from 'react-router-dom'
import { AvailableProxyModel } from '~/api/Procuration/procuration.model'
import paths from '~/shared/paths'
import { isAxiosError } from 'axios'
import { closeSnackbar, enqueueSnackbar } from 'notistack'
import buildExtraData from '~/components/Mandates/Utils/buildExtraData'
import { useCallback } from 'react'

export default function MandateValidationPage() {
  const params = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()

  const { data } = useProcurationRequest({ uuid: params.id })
  const { mutateAsync, isLoading: isMatching } = useProcurationMatch()

  if (state === null) {
    navigate(-1)
  }

  const { proxy }: { proxy: AvailableProxyModel } = state

  const onLink = useCallback(() => {
    const { id } = params

    if (!id || !proxy) {
      return
    }

    mutateAsync({
      uuid: id,
      proxy: proxy.uuid,
    })
      .then(() => {
        // We don't use "useSessionStorage" as it is not instant
        sessionStorage.setItem(
          'procurationSuccessFlash',
          JSON.stringify({
            mandate: data!.first_names,
            proxy: proxy.first_names,
          })
        )
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
  }, [data, mutateAsync, navigate, params, proxy])

  return (
    <Page backButton>
      <DottedCard>
        <Grid container spacing={MuiSpacing.normal}>
          <Grid item xs={12} mb={MuiSpacing.normal}>
            <Paper sx={{ p: MuiSpacing.normal }}>
              <Grid container>
                <Typography fontSize={14}>
                  Veillez à bien relire les informations avant de confirmer la liaison. Que se passera-t-il ensuite ?
                </Typography>

                <List>
                  <ListItem>
                    <Typography fontSize={14}>
                      <MandantSpan>1. {data?.first_names}</MandantSpan> recevra un email duquel{' '}
                      <ProxySpan>{proxy.first_names}</ProxySpan> et vous même serez en copie.
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography fontSize={14}>
                      <MandantSpan>2. {data?.first_names}</MandantSpan> trouvera dans cet email les informations
                      nécessaires à la réalisation de la procuration qu’il devra confirmer à{' '}
                      <ProxySpan>{proxy.first_names}</ProxySpan>
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography fontSize={14}>
                      <ProxySpan>3. {proxy.first_names}</ProxySpan> devra se déplacer dans le bureau de vote de{' '}
                      <MandantSpan>{data?.first_names}</MandantSpan> (
                      <Typography fontSize={14} color={'success.main'}>
                        {data?.vote_place_name}
                      </Typography>
                      ) pour aller voter le 9 juin.
                    </Typography>
                  </ListItem>
                </List>

                <Grid item mb={MuiSpacing.normal} xs={12}>
                  <Divider />
                </Grid>

                <Grid container sx={{ mb: MuiSpacing.small }} spacing={MuiSpacing.normal}>
                  <Grid item xs={4} sm={3}>
                    <Typography fontWeight={fontWeight.medium} color={'text.secondary'} fontSize={12}>
                      Bureau de vote
                    </Typography>
                  </Grid>
                  <Grid item xs={8} sm={9}>
                    <Typography fontSize={14} color={'success.main'}>
                      {data?.vote_place_name}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid item xs={12} textAlign={'right'}>
                  <Button startIcon={<Icon />} variant={'contained'} disabled={isMatching} onClick={onLink}>
                    Lier
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
            {proxy ? (
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
            ) : (
              <SkeletonCard />
            )}
          </Grid>
        </Grid>
      </DottedCard>
    </Page>
  )
}

const DottedCard = styled.div({
  border: `1px dashed ${grey[300]}`,
  backgroundColor: grey[100],
  padding: CssSpacing.large,
  borderRadius: 8,
  marginTop: CssSpacing.large,
})

const MandantSpan = styled.span({
  color: other.Mandant,
})

const ProxySpan = styled.span({
  color: other.Proxy,
})

const Icon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M19 14C20.49 12.54 22 10.79 22 8.5C22 7.04131 21.4205 5.64236 20.3891 4.61091C19.3576 3.57946 17.9587 3 16.5 3C14.74 3 13.5 3.5 12 5C10.5 3.5 9.26 3 7.5 3C6.04131 3 4.64236 3.57946 3.61091 4.61091C2.57946 5.64236 2 7.04131 2 8.5C2 10.8 3.5 12.55 5 14L12 21L19 14Z"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.9996 5L9.03961 7.96C8.83644 8.1617 8.67518 8.40162 8.56514 8.66593C8.45509 8.93023 8.39844 9.2137 8.39844 9.5C8.39844 9.7863 8.45509 10.0698 8.56514 10.3341C8.67518 10.5984 8.83644 10.8383 9.03961 11.04C9.85961 11.86 11.1696 11.89 12.0396 11.11L14.1096 9.21C14.6285 8.73919 15.304 8.47839 16.0046 8.47839C16.7052 8.47839 17.3808 8.73919 17.8996 9.21L20.8596 11.87"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M18 15L16 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15 18L13 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
