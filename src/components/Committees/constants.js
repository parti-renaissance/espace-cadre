import { zoneTypes } from 'domain/zone'

export const committeeZones = [zoneTypes.CITY, zoneTypes.CANTON, zoneTypes.BOROUGH, zoneTypes.CITY_COMMUNITY]

export const electionStatus = {
  not_started: 'not_started',
  scheduled: 'scheduled',
  in_progress: 'in_progress',
  closed: 'closed',
  canceled: 'canceled',
}
