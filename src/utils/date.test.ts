import { differenceInCalendarYears, parseISO } from 'date-fns'
import {
  getAge,
  getAgendaDate,
  getDayNumber,
  getFormattedDate,
  getHumanFormattedDate,
  getHumanFormattedTime,
  getNowFormattedDate,
  getShortDayName,
} from '~/utils/date'
import { expect } from 'vitest'

describe('Date functions', () => {
  const foundation = '2016-04-06T14:00:00'
  const parsedFoundation = parseISO(foundation)

  it('Should output 🇫🇷 date', () => {
    expect(getFormattedDate(parsedFoundation)).toBe('06/04/2016')
    expect(getHumanFormattedDate(parsedFoundation)).toBe('mer. 6 avril 2016')
    expect(getHumanFormattedTime(parsedFoundation)).toBe('14:00')
    expect(getShortDayName(parsedFoundation)).toBe('mer.')
    expect(getDayNumber(parsedFoundation)).toBe('6')
    expect(getAgendaDate(parsedFoundation)).toBe('mer. 6')
    expect(getNowFormattedDate()).toBe(getHumanFormattedDate(new Date()))
  })

  it('Should compute age', () => {
    expect(getAge(parsedFoundation)).toBe(`${differenceInCalendarYears(new Date(), parsedFoundation)} ans`)
  })
})
