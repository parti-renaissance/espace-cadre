import pluralize from '~/components/shared/pluralize/pluralize'
import { KPICard, KPIs } from '~/ui/Kpi/KPIs'
import { useQueryWithScope } from '~/api/useQueryWithScope'
import { getPhoningGlobalKPIQuery } from '~/api/phoning'
import PropTypes from 'prop-types'

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

const CampaignGlobalKPI = ({ refreshKPIs }) => {
  const {
    data: { campaigns, surveys, calls } = {},
    isLoading,
    isError,
  } = useQueryWithScope(['global-KPI', { feature: 'Phoning', view: 'CampaignGlobalKPI' }, refreshKPIs], () =>
    getPhoningGlobalKPIQuery()
  )

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
            main={calls.count}
            title={pluralize(calls.count, messages.call)}
            subtitle={`${calls.onAMonth} ${messages.callOnAMonth}`}
          />
        </>
      )}
    </KPIs>
  )
}

CampaignGlobalKPI.propTypes = {
  refreshKPIs: PropTypes.number,
}

export default CampaignGlobalKPI
