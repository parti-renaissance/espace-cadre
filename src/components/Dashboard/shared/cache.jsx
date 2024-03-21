import { hoursToMilliseconds, minutesToMilliseconds } from 'date-fns'

const ONE_HOUR = hoursToMilliseconds(1)

export const DASHBOARD_CACHE_DURATION = ONE_HOUR
export const COLD_DATA_CACHE_DURATION = ONE_HOUR
export const HOT_DATA_CACHE_DURATION = minutesToMilliseconds(5)
