import PropTypes from 'prop-types'
import { KPIs, KPICard } from 'ui/Kpi/KPIs'
import pluralize from '../../shared/pluralize/pluralize'

const messages = {
  visitedPrefix: 'Adresse',
  visitedSuffix: 'visitée',
  toVisit: 'à visiter',
  surveys: 'Questionnaire',
  door: 'Porte',
  knocked: 'frappée',
}

const CampaignDetailKPI = ({ campaignData }) => (
  <KPIs>
    <KPICard
      main={campaignData?.visitedAddresses}
      title={
        <>
          {pluralize(campaignData?.visitedAddresses, messages.visitedPrefix)}&nbsp;
          {pluralize(campaignData?.visitedAddresses, messages.visitedSuffix)}
        </>
      }
    />
    <KPICard
      main={campaignData?.toVisitAddresses}
      title={
        <>
          {pluralize(campaignData?.toVisitAddresses, messages.visitedPrefix)}&nbsp;
          {messages.toVisit}
        </>
      }
    />
    <KPICard
      main={campaignData?.filledSurveys}
      title={<>{pluralize(campaignData?.filledSurveys, messages.surveys)}</>}
    />
    <KPICard
      main={campaignData?.knockedDoors}
      title={
        <>
          {pluralize(campaignData?.knockedDoors, messages.door)}&nbsp;
          {pluralize(campaignData?.knockedDoors, messages.knocked)}
        </>
      }
    />
  </KPIs>
)

export default CampaignDetailKPI

CampaignDetailKPI.propTypes = {
  campaignData: PropTypes.object,
}
