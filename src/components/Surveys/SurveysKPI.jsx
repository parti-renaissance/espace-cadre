import PropTypes from 'prop-types'
import pluralize from '~/components/shared/pluralize/pluralize'
import scopes from '~/shared/scopes'

import { KPICard, KPIs } from '~/ui/Kpi/KPIs'

const messages = {
  including: 'Dont',
  published: 'publié',
  answer: 'Réponse',
  collected: 'collectée',
  byTheMonth: 'sur le mois',
}

const SurveysKPI = ({ local, national, currentScope }) => (
  <KPIs>
    <KPICard
      main={local.count}
      title={local.title}
      subtitle={`${messages.including} ${local.publishedCount} ${pluralize(local.publishedCount, messages.published)}`}
    />
    {currentScope !== scopes.legislative_candidate && (
      <KPICard
        main={national.count}
        title={national.title}
        subtitle={`${messages.including} ${national.publishedCount} ${pluralize(
          national.publishedCount,
          messages.published
        )}`}
      />
    )}
  </KPIs>
)

SurveysKPI.propTypes = {
  local: PropTypes.shape({
    count: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    publishedCount: PropTypes.number,
  }),
  national: PropTypes.shape({
    count: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    publishedCount: PropTypes.number,
  }),
  currentScope: PropTypes.string.isRequired,
}

export default SurveysKPI
