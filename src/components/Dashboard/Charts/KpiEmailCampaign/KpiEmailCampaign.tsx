import Percentage from '~/ui/Percentage'
import pluralize from '~/components/shared/pluralize/pluralize'
import { reportsRatio } from '~/api/messagerie'
import { useScopedQueryKey } from '~/api/useQueryWithScope'
import { useQuery } from '@tanstack/react-query'
import { DASHBOARD_CACHE_DURATION } from '~/components/Dashboard/shared/cache'
import { KPICard, KPIs } from '~/ui/Kpi/KPIs'
import { Divider } from '@mui/material'
import EmailIllustration from '~/assets/illustrations/email-illustration'
import ReadingTextIllustration from '~/assets/illustrations/reading-text-illustration'
import TargetIllustration from '~/assets/illustrations/target-illustration'
import { styled } from '@mui/system'

import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

const messages = {
  campaign: 'Nombre',
  email: "d'emails",
  sent: 'Envoyée',
  sentSuffix: 'ces 30 derniers jours',
  opening: 'Ouvertures',
  national: 'au national',
  clicks: 'Clics',
  unsubscribing: 'Désabonnements',
  errorLoading: 'Impossible de récupérer les données',
}

const StyledDivider = styled(Divider)({
  height: 'auto',
  borderWidth: 1,
  borderStyle: 'dashed',
  marginRight: -1,
}) as typeof Divider

const CustomDivider = () => {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('md'))
  if (matches) {
    return null
  }
  return <StyledDivider orientation="vertical" sx={{ display: { xs: 'none', md: 'block' } }} />
}

const KpiEmailCampaign = () => {
  const queryKey = useScopedQueryKey(['campaigns-report-ratios', { feature: 'Dashboard', view: 'KpiEmailCampaign' }])
  const {
    data: campaignsReportRatios = null,
    isLoading,
    isError,
  } = useQuery(queryKey, () => reportsRatio(), {
    cacheTime: DASHBOARD_CACHE_DURATION,
    staleTime: DASHBOARD_CACHE_DURATION,
  })

  return (
    <KPIs isLoading={isLoading} error={isError && !!messages.errorLoading}>
      {campaignsReportRatios && (
        <>
          <KPICard
            main={campaignsReportRatios.local.campaignsCount}
            title={`${pluralize(campaignsReportRatios.local.campaignsCount, messages.campaign)} ${messages.email}`}
            subtitle={`${pluralize(campaignsReportRatios.local.campaignsCount, messages.sent)} ${messages.sentSuffix}`}
            icon={<EmailIllustration height={50} />}
          />
          <CustomDivider />
          <KPICard
            main={<Percentage>{campaignsReportRatios.local.openRate}</Percentage>}
            title={messages.opening}
            icon={<ReadingTextIllustration height={50} />}
            subtitle={
              <>
                <Percentage>{campaignsReportRatios.national.openRate}</Percentage> {messages.national}
              </>
            }
          />
          <CustomDivider />
          <KPICard
            main={<Percentage>{campaignsReportRatios.local.clickRate}</Percentage>}
            title={messages.clicks}
            icon={<TargetIllustration height={50} />}
            subtitle={
              <>
                <Percentage>{campaignsReportRatios.national.clickRate}</Percentage> {messages.national}
              </>
            }
          />
          <CustomDivider />
          <KPICard
            main={<Percentage>{campaignsReportRatios.local.unsubscribeRate}</Percentage>}
            title={messages.unsubscribing}
            icon={<TargetIllustration height={50} />}
            subtitle={
              <>
                <Percentage>{campaignsReportRatios.national.unsubscribeRate}</Percentage> {messages.national}
              </>
            }
          />
        </>
      )}
    </KPIs>
  )
}

export default KpiEmailCampaign
