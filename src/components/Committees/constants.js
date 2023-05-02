import { zoneTypes } from 'domain/zone'

export const committeeZones = [zoneTypes.CANTON, zoneTypes.CITY_COMMUNITY, zoneTypes.CITY, zoneTypes.BOROUGH]

export const electionStatus = {
  not_started: 'not_started',
  scheduled: 'scheduled',
  in_progress: 'in_progress',
  closed: 'closed',
  canceled: 'canceled',
}
