import { differenceInCalendarDays, format } from 'date-fns'

import pluralize from 'components/shared/pluralize/pluralize'
import { PhoningCampaignDetailKPI as DomainPhoningCampaignDetailKPI } from 'domain/phoning'

import { secondsToMinutesAndSeconds } from './shared/helpers'
import { KpiCard, KpiProgressCard, KPIs } from 'ui/Kpi/KPIs'

const messages = {
  day: 'Jour',
  remaining: 'restant',
  periodFrom: 'Du',
  periodTo: 'au',
  surveys: 'Questionnaire',
  calls: 'Appel',
  callsMade: 'passé',
  callsToRemindPrefix: 'Dont',
  callsToRemindSuffix: 'à rappeler',
  contacts: 'Contacts',
  averageTime: 'Temps moyen',
  averageTimeDetail: 'Passé par appel',
}

const CampaignDetailKPI = ({ remaining, surveys, calls, averageTime }) => {
  const daysRemaining = differenceInCalendarDays(remaining.endDate, new Date()) || 0

  return (
    <KPIs data-cy="phoning-campaign-detail-KPI">
      <>
        <KpiCard
          main={daysRemaining <= 0 ? 0 : daysRemaining}
          title={`${pluralize(daysRemaining, messages.day)} ${pluralize(daysRemaining, messages.remaining)}`}
          subtitle={
            remaining.startDate &&
            remaining.endDate &&
            `${messages.periodFrom} ${format(remaining.startDate, 'dd/MM/yyyy')} ${messages.periodTo} ${format(
              remaining.endDate,
              'dd/MM/yyyy'
            )}`
          }
        />
        <KpiProgressCard
          title={pluralize(surveys.count, messages.surveys)}
          count={surveys.count}
          total={surveys.goal}
        />
        <KpiCard
          main={calls.count}
          title={`${pluralize(calls.count, messages.calls)} ${pluralize(calls.count, messages.callsMade)}`}
          subtitle={`${messages.callsToRemindPrefix} ${calls.toRemind} ${messages.callsToRemindSuffix}`}
        />
        <KpiCard
          main={secondsToMinutesAndSeconds(averageTime)}
          title={messages.averageTime}
          subtitle={messages.averageTimeDetail}
        />
      </>
    </KPIs>
  )
}

CampaignDetailKPI.propTypes = DomainPhoningCampaignDetailKPI.propTypes

export default CampaignDetailKPI
