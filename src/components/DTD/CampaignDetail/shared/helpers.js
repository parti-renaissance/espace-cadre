import { isBefore, isAfter } from 'date-fns'
import { chipLabelByStatus, chipColorsByStatus, multipleChoice, simpleField, uniqueChoice } from './constants'

export const secondsToMinutes = seconds => (Number.isInteger(seconds) ? `${Math.floor(seconds / 60)} min` : null)

export const chipColorsByDate = (startDate, endDate) => {
  if (isBefore(new Date(), startDate)) return chipColorsByStatus.tocome
  if (isBefore(new Date(), endDate)) return chipColorsByStatus.ongoing
  if (isAfter(new Date(), endDate)) return chipColorsByStatus.finished
}

export const chipLabelByDate = (startDate, endDate) => {
  if (isBefore(new Date(), startDate)) return chipLabelByStatus.tocome
  if (isBefore(new Date(), endDate)) return chipLabelByStatus.ongoing
  if (isAfter(new Date(), endDate)) return chipLabelByStatus.finished
}

export const surveysColumnsStyles = {
  called: {
    minWidth: '175px',
    maxWidth: '175px',
  },
  time: {
    minWidth: '150px',
    maxWidth: '150px',
  },
  [simpleField]: {
    minWidth: '300px',
    maxWidth: '300px',
  },
  [uniqueChoice]: {
    minWidth: '200px',
    maxWidth: '200px',
  },
  [multipleChoice]: {
    minWidth: '200px',
    maxWidth: '200px',
  },
}
