import PropTypes from 'prop-types'
import pluralize from 'components/shared/pluralize/pluralize'

import { KPICard, KPIs } from 'ui/Kpi/KPIs'

const messages = {
  including: 'Dont',
  published: 'publié',
  answer: 'Réponse',
  collected: 'collectée',
  byTheMonth: 'sur le mois',
}

const SurveysKPI = ({ local, national }) => (
  <KPIs>
    <KPICard
      main={local.count}
      title={local.title}
      subtitle={`${messages.including} ${local.publishedCount} ${pluralize(local.publishedCount, messages.published)}`}
    />
    <KPICard main={national.count} title={national.title} />
  </KPIs>
)

SurveysKPI.propTypes = {
  local: PropTypes.shape({
    count: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    publishedCount: PropTypes.number.isRequired,
  }),
  national: PropTypes.shape({
    count: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
  }),
}

export default SurveysKPI
