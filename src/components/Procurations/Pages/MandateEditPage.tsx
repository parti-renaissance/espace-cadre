import { Button, Checkbox, FormControlLabel, FormGroup, Grid, Paper, Typography } from '@mui/material'
import { isAxiosError } from 'axios'
import { closeSnackbar, enqueueSnackbar } from 'notistack'
import { useCallback, useState } from 'react'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'
import useProcurationRequest from '~/api/Procuration/Hooks/useProcurationRequest'
import useProcurationUnmatch from '~/api/Procuration/Hooks/useProcurationUnmatch'
import DottedCard from '~/components/DottedCard/DottedCard'
import Page from '~/components/Page/Page'
import MandatePersonCard, {
  MandatePersonCardType,
} from '~/components/Procurations/Components/MandantTab/Components/MandatePersonCard/MandatePersonCard'
import buildExtraData from '~/components/Procurations/Utils/buildExtraData'
import SkeletonCard from '~/components/Skeleton/SkeletonCard'
import paths from '~/shared/paths'
import { MuiSpacing } from '~/theme/spacing'
import { fontWeight } from '~/theme/typography'
import { getFormattedDate } from '~/utils/date'
import { fullName } from '~/utils/names'
import Divider from '@mui/material/Divider'
import { grey } from '~/theme/palette'

export default function MandateEditPage() {
  const params = useParams()
  const navigate = useNavigate()

  const { data } = useProcurationRequest({ uuid: params.id })
  const { mutateAsync, isLoading: isUnmatching } = useProcurationUnmatch()

  const [noEmailCopy, setNoEmailCopy] = useState<boolean>(false)

  const slot = data?.request_slots?.find(slot => slot.round.uuid === params.round)
  const proxy = slot?.proxy

  const onToggle = useCallback(() => {
    setNoEmailCopy(v => !v)
  }, [])

  const onUnmatch = useCallback(() => {
    const { id } = params

    if (!id || !proxy) {
      return
    }

    mutateAsync({
      uuid: id,
      proxy: proxy.uuid,
      round: params.round,
      emailCopy: !noEmailCopy,
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
  }, [mutateAsync, navigate, params, proxy, noEmailCopy])

  return (
    <Page backButton>
      <DottedCard>
        <Grid container spacing={MuiSpacing.normal}>
          <Grid item xs={12} mb={MuiSpacing.normal}>
            <Paper sx={{ p: MuiSpacing.normal }}>
              <Grid container>
                <Grid container sx={{ mb: MuiSpacing.small }} spacing={MuiSpacing.normal}>
                  <InfoLine label={'Tour'} value={slot?.round.name}></InfoLine>
                  <InfoLine label={'Bureau de vote'} value={data?.vote_place_name}></InfoLine>
                  <InfoLine
                    label={'Date de l’association'}
                    value={data?.matched_at ? getFormattedDate(data?.matched_at) : ''}
                    color={'text.primary'}
                  ></InfoLine>
                  <InfoLine
                    label={'Auteur'}
                    value={data?.matcher ? fullName(data.matcher) : ''}
                    color={'text.primary'}
                  ></InfoLine>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  <Grid item xs={12}>
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox checked={noEmailCopy} onChange={onToggle} />}
                        style={{ color: grey[600] }}
                        label="Ne pas être mis en copie de l’email envoyé au mandant et au mandataire."
                      />
                    </FormGroup>
                  </Grid>
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
                history={data.actions}
                firstName={data.first_names}
                lastName={data.last_name}
                status={data.status}
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
            ) : (
              <SkeletonCard />
            )}
          </Grid>

          <Grid item xs={12} sm={12} md={6}>
            {proxy ? (
              <MandatePersonCard
                history={data.actions}
                firstName={proxy.first_names}
                lastName={proxy.last_name}
                status={proxy.status}
                id={proxy.id}
                location={proxy.vote_zone.name}
                tags={proxy.tags ?? []}
                votePlace={proxy.vote_place_name}
                type={MandatePersonCardType.MATCH_PROXY}
                extraInfos={buildExtraData(proxy)}
                expended
                hideActions
                hideStateActions
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
