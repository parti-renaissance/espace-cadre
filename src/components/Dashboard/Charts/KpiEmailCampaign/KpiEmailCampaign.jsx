import Percentage from '~/ui/Percentage'
import pluralize from '~/components/shared/pluralize/pluralize'
import { reportsRatio } from '~/api/messagerie'
import { useQueryWithScope } from '~/api/useQueryWithScope'
import { DASHBOARD_CACHE_DURATION } from '~/components/Dashboard/shared/cache'
import { KPICard, KPIs } from '~/ui/Kpi/KPIs'

const messages = {
  campaign: 'Campagne',
  email: "d'e-mails",
  sent: 'Envoyée',
  sentSuffix: 'ces 30 derniers jours',
  opening: 'Ouvertures',
  national: 'au national',
  clicks: 'Clics',
  unsubscribing: 'Désabonnements',
  errorLoading: 'Impossible de récupérer les données',
}

const KpiEmailCampaign = () => {
  const {
    data: campaignsReportRatios = null,
    isLoading,
    isError,
  } = useQueryWithScope(
    ['campaigns-report-ratios', { feature: 'Dashboard', view: 'KpiEmailCampaign' }],
    () => reportsRatio(),
    {
      cacheTime: DASHBOARD_CACHE_DURATION,
      staleTime: DASHBOARD_CACHE_DURATION,
    }
  )

  return (
    <KPIs isLoading={isLoading} error={isError && messages.errorLoading}>
      {campaignsReportRatios && (
        <>
          <KPICard
            main={campaignsReportRatios.local.campaignsCount}
            title={`${pluralize(campaignsReportRatios.local.campaignsCount, messages.campaign)} ${messages.email}`}
            subtitle={`${pluralize(campaignsReportRatios.local.campaignsCount, messages.sent)} ${messages.sentSuffix}`}
          />
          <KPICard
            main={<Percentage>{campaignsReportRatios.local.openRate}</Percentage>}
            title={messages.opening}
            subtitle={
              <>
                <Percentage>{campaignsReportRatios.national.openRate}</Percentage> {messages.national}
              </>
            }
          />
          <KPICard
            main={<Percentage>{campaignsReportRatios.local.clickRate}</Percentage>}
            title={messages.clicks}
            subtitle={
              <>
                <Percentage>{campaignsReportRatios.national.clickRate}</Percentage> {messages.national}
              </>
            }
          />
          <KPICard
            main={<Percentage>{campaignsReportRatios.local.unsubscribeRate}</Percentage>}
            title={messages.unsubscribing}
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
