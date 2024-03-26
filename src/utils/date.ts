import { differenceInCalendarYears } from 'date-fns'
import pluralize from '~/components/shared/pluralize/pluralize'
import { formatDate } from '~/shared/helpers'

export const dateFormat = 'P'
export const timeFormat = 'p'
export const humanReadableDate = 'ccc d MMMM yyyy'

export const dateShortFormat = 'EE' // Mon, Tue, ...
export const dateValueFormat = 'd' // 1, 2, 3

export const agendaDateFormat = 'EE d'

export const getFormattedDate = (date: Date | string) => formatDate(date, dateFormat)

export const getHumanFormattedDate = (date: Date | string) => formatDate(date, humanReadableDate)
export const getHumanFormattedTime = (date: Date | string) => formatDate(date, timeFormat)

export const getAgendaDate = (date: Date | string) => formatDate(date, agendaDateFormat)

export const getNowFormattedDate = () => formatDate(new Date(), humanReadableDate)

export const getShortDayName = (date: Date) => formatDate(date, dateShortFormat)
export const getDayNumber = (date: Date) => formatDate(date, dateValueFormat)

export const getAge = (date: Date) => {
  const difference = differenceInCalendarYears(new Date(), date)

  return `${difference} ${pluralize(difference, 'an')}`
}
