import PropTypes from 'prop-types'
import { KPIs, KPICard } from 'ui/Kpi/KPIs'

const CampaignDetailKPI = ({ campaignData }) => {
  console.log(campaignData)

  return (
    <KPIs>
      <KPICard main="pépito" title="Sanchez" subtitle="Debout" />
    </KPIs>
  )
}

export default CampaignDetailKPI

CampaignDetailKPI.propTypes = {
  campaignData: PropTypes.object,
}
