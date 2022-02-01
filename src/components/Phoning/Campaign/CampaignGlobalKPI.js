import { PhoningGlobalKPI as DomainPhoningGlobalKPI } from 'domain/phoning'
import pluralize from 'components/shared/pluralize/pluralize'
import { KpiCard, KPIs } from 'ui/Kpi/KPIs'
import { useQueryWithScope } from 'api/useQueryWithScope'
import { getPhoningGlobalKPIQuery } from 'api/phoning'

const messages = {
  campaign: 'Campagne',
  ongoingCampaignPrefix: 'Dont',
  ongoingCampaignSuffix: 'en cours',
  survey: 'Questionnaire',
  surveyOnAMonth: 'sur un mois',
  call: 'Appel',
  callOnAMonth: 'sur un mois',
  errorLoading: 'Impossible de récupérer les données',
}

const CampaignGlobalKPI = () => {
  const {
    data: { campaigns, surveys, calls } = {},
    isLoading,
    isError,
  } = useQueryWithScope(['phoning', 'globalKPI'], () => getPhoningGlobalKPIQuery(), {})

  return (
    <KPIs isLoading={isLoading} error={isError && messages.errorLoading}>
      {!isLoading && !isError && (
        <>
          <KpiCard
            main={campaigns.count}
            title={pluralize(campaigns.count, messages.campaign)}
            subtitle={`${messages.ongoingCampaignPrefix} ${campaigns.ongoing} ${messages.ongoingCampaignSuffix}`}
          />
          <KpiCard
            main={surveys.count}
            title={pluralize(surveys.count, messages.survey)}
            subtitle={`${surveys.onAMonth} ${messages.surveyOnAMonth}`}
          />
          <KpiCard
            main={calls.count}
            title={pluralize(calls.count, messages.call)}
            subtitle={`${calls.onAMonth} ${messages.callOnAMonth}`}
          />
        </>
      )}
    </KPIs>
  )
}

CampaignGlobalKPI.propTypes = DomainPhoningGlobalKPI.propTypes

export default CampaignGlobalKPI
