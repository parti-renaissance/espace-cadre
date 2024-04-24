import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { getTimezoneOffset, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'

/**
 * Get the initials of the name passed as parameter.
 *
 * @param {string | null} name
 * @returns string|null
 */
export function getInitialNames(name = null) {
  if (name === null) {
    return null
  }

  const arrayNames = name.split(' ')
  if (arrayNames.length === 1) {
    const currentName = arrayNames[0]
    return currentName.substring(0, 2).toUpperCase()
  }

  if (arrayNames.length > 1) {
    const firstName = arrayNames.shift(0).substring(0, 1)
    const lastName = arrayNames.pop().substring(0, 1)
    return `${firstName}${lastName}`.toUpperCase()
  }
}

export function formatDate(date, formatPattern) {
  return `${format(typeof date === 'string' ? parseISO(date) : date, formatPattern, { locale: fr })}`
}

export function parseDate(date) {
  return typeof date === 'string' ? parseISO(date) : date
}

export function parseDateWithTZ(date, tz) {
  const dateInUtc = zonedTimeToUtc(date, 'Europe/Paris')
  return utcToZonedTime(dateInUtc, tz)
}

export function getTimezoneOffsetLabel(timeZone) {
  const offset = getTimezoneOffset(timeZone)

  return `UTC ${offset < 0 ? '' : '+'}${offset / 1000 / 60 / 60}h`
}

export const getFullName = user => `${user.first_name} ${user.last_name}`
