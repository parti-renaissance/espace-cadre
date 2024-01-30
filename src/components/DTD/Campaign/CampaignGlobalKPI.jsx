import { DTDGlobalKPI as DomainDTDGlobalKPI } from '~/domain/DTD'
import pluralize from '~/components/shared/pluralize/pluralize'
import { KPICard, KPIs } from '~/ui/Kpi/KPIs'
import { useQueryWithScope } from '~/api/useQueryWithScope'
import { getDTDGlobalKPIQuery } from '~/api/DTD'

const messages = {
  campaign: 'Campagne',
  ongoingCampaignPrefix: 'Dont',
  ongoingCampaignSuffix: 'en cours',
  survey: 'Questionnaire',
  surveyOnAMonth: 'sur un mois',
  knocked: 'Porte',
  door: 'frappée',
  knockedDoorOnAMonth: 'sur un mois',
  errorLoading: 'Impossible de récupérer les données',
}

const DTDGlobalKPI = () => {
  const {
    data: { campaigns, surveys, calls: doors } = {},
    isLoading,
    isError,
  } = useQueryWithScope(['global-KPI', { feature: 'DTD', view: 'DTDGlobalKPI' }], () => getDTDGlobalKPIQuery())

  return (
    <KPIs isLoading={isLoading} error={isError && messages.errorLoading}>
      {!isLoading && !isError && (
        <>
          <KPICard
            main={campaigns.count}
            title={pluralize(campaigns.count, messages.campaign)}
            subtitle={`${messages.ongoingCampaignPrefix} ${campaigns.ongoing} ${messages.ongoingCampaignSuffix}`}
          />
          <KPICard
            main={surveys.count}
            title={pluralize(surveys.count, messages.survey)}
            subtitle={`${surveys.onAMonth} ${messages.surveyOnAMonth}`}
          />
          <KPICard
            main={doors.count}
            title={pluralize(doors.count, messages.knocked)}
            subtitle={`${doors.onAMonth} ${messages.knockedDoorOnAMonth}`}
          />
        </>
      )}
    </KPIs>
  )
}

DTDGlobalKPI.propTypes = DomainDTDGlobalKPI.propTypes

export default DTDGlobalKPI
