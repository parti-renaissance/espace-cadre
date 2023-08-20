import { differenceInCalendarDays } from 'date-fns'

import pluralize from 'components/shared/pluralize/pluralize'
import { PhoningCampaignDetailKPI as DomainPhoningCampaignDetailKPI } from 'domain/phoning'

import { secondsToMinutesAndSeconds } from './shared/helpers'
import { KPICard, KPIProgressCard, KPIs } from 'ui/Kpi/KPIs'
import { formatDate } from 'shared/helpers'

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
    <KPIs>
      <>
        <KPICard
          main={daysRemaining <= 0 ? 0 : daysRemaining}
          title={`${pluralize(daysRemaining, messages.day)} ${pluralize(daysRemaining, messages.remaining)}`}
          subtitle={
            remaining.startDate &&
            remaining.endDate &&
            `${messages.periodFrom} ${formatDate(remaining.startDate, 'dd/MM/yyyy')} ${messages.periodTo} ${formatDate(
              remaining.endDate,
              'dd/MM/yyyy'
            )}`
          }
        />
        <KPIProgressCard
          title={pluralize(surveys.count, messages.surveys)}
          count={surveys.count}
          total={surveys.goal}
        />
        <KPICard
          main={calls.count}
          title={`${pluralize(calls.count, messages.calls)} ${pluralize(calls.count, messages.callsMade)}`}
          subtitle={`${messages.callsToRemindPrefix} ${calls.toRemind} ${messages.callsToRemindSuffix}`}
        />
        <KPICard
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
