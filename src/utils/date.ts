import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export const dateFormat = 'P'
export const timeFormat = 'p'
export const humanReadableDate = 'ccc d MMMM yyyy'

export const dateShortFormat = 'EE' // Mon, Tue, ...
export const dateValueFormat = 'd' // 1, 2, 3

export const agendaDateFormat = 'EE d'

const localeOptions = { locale: fr }

export const getFormattedDate = (date: Date) => format(date, dateFormat, localeOptions)

export const getHumanFormattedDate = (date: Date) => format(date, humanReadableDate, localeOptions)
export const getHumanFormattedTime = (date: Date) => format(date, timeFormat, localeOptions)

export const getAgendaDate = (date: Date) => format(date, agendaDateFormat, localeOptions)

export const getNowFormattedDate = () => format(new Date(), humanReadableDate, localeOptions)

export const getShortDayName = (date: Date) => format(date, dateShortFormat, localeOptions)
export const getDayNumber = (date: Date) => format(date, dateValueFormat, localeOptions)
