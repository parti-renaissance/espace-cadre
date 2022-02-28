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

const SurveysKPI = ({ local, national, collectedAnswers }) => (
  <KPIs>
    <KPICard
      main={local.count}
      title={local.title}
      subtitle={`${messages.including} ${local.publishedCount} ${pluralize(local.publishedCount, messages.published)}`}
    />
    <KPICard main={national.count} title={national.title} />
    <KPICard
      main={collectedAnswers.count}
      title={`${pluralize(collectedAnswers.count, messages.answer)} ${pluralize(
        collectedAnswers.count,
        messages.collected
      )}`}
      subtitle={`${collectedAnswers.byTheMonth} ${messages.byTheMonth}`}
    />
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
  collectedAnswers: PropTypes.shape({
    count: PropTypes.number.isRequired,
    byTheMonth: PropTypes.number.isRequired,
  }),
}

export default SurveysKPI
