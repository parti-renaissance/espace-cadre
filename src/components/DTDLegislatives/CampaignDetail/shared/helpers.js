import { isBefore } from 'date-fns'
import { chipLabelByStatus, chipColorsByStatus, multipleChoice, simpleField, uniqueChoice } from './constants'

const today = new Date()

export const secondsToMinutes = seconds => (Number.isInteger(seconds) ? `${Math.floor(seconds / 60)} min` : null)

export const chipColorsByDate = (startDate, endDate) => {
  if (isBefore(today, startDate)) {
    return chipColorsByStatus.tocome
  }
  if (isBefore(today, endDate)) {
    return chipColorsByStatus.ongoing
  }
  return chipColorsByStatus.finished
}

export const chipLabelByDate = (startDate, endDate) => {
  const today = new Date()

  if (isBefore(today, startDate)) {
    return chipLabelByStatus.tocome
  }
  if (isBefore(today, endDate)) {
    return chipLabelByStatus.ongoing
  }
  return chipLabelByStatus.finished
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
