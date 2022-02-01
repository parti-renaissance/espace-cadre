import { differenceInCalendarDays, format } from 'date-fns'

import pluralize from 'components/shared/pluralize/pluralize'
import { DTDCampaignDetailKPI as DomainDTDCampaignDetailKPI } from 'domain/DTD'
import { KpiCard, KPIs } from 'ui/Kpi/KPIs'

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
    <KPIs data-cy="DTD-campaign-detail-KPI">
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
        <KpiCard main={surveys.count} title={pluralize(surveys.count, messages.surveys)} />
        <KpiCard
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
        <KpiCard
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
