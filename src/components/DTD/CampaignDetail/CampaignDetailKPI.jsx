import { differenceInCalendarDays } from 'date-fns'

import pluralize from '~/components/shared/pluralize/pluralize'
import { DTDCampaignDetailKPI as DomainDTDCampaignDetailKPI } from '~/domain/DTD'
import { KPICard, KPIs } from '~/ui/Kpi/KPIs'
import { formatDate } from '~/shared/helpers'

const messages = {
  day: 'Jour',
  remaining: 'restant',
  periodFrom: 'Du',
  periodTo: 'au',
  surveys: 'Questionnaire',
  doors: 'Porte',
  doorsKnocked: 'frappée',
  doorsToRemindPrefix: 'Dont',
  doorsToRemindSuffix: 'ouverte',
  contacts: 'Contact',
  contactsCollected: 'collecté',
  contactsInvitation: 'invitation',
  contactsToJoin: 'à adhérer',
}

const CampaignDetailKPI = ({ remaining, surveys, doors, contacts }) => {
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
        <KPICard main={surveys.count} title={pluralize(surveys.count, messages.surveys)} />
        <KPICard
          main={doors.knockedCount}
          title={`${pluralize(doors.knockedCount, messages.doors)} ${pluralize(
            doors.knockedCount,
            messages.doorsKnocked
          )}`}
          subtitle={
            (Number.isInteger(doors.openCount) || null) &&
            `${messages.doorsToRemindPrefix} ${doors.openCount} ${pluralize(
              doors.openCount,
              messages.doorsToRemindSuffix
            )}`
          }
        />
        <KPICard
          main={contacts.collectedCount}
          title={`${pluralize(contacts.collectedCount, messages.contacts)} ${pluralize(
            contacts.collectedCount,
            messages.contactsCollected
          )}`}
          subtitle={
            contacts.toJoinCount &&
            `${contacts.toJoinCount} ${pluralize(contacts.toJoinCount, messages.contactsInvitation)} ${
              messages.contactsToJoin
            }`
          }
        />
      </>
    </KPIs>
  )
}

CampaignDetailKPI.propTypes = DomainDTDCampaignDetailKPI.propTypes

export default CampaignDetailKPI
