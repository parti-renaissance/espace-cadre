import { isBefore } from 'date-fns'
import { chipLabelByStatus, chipColorsByStatus } from './constants'

const today = new Date()

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
  if (isBefore(today, startDate)) {
    return chipLabelByStatus.tocome
  }
  if (isBefore(today, endDate)) {
    return chipLabelByStatus.ongoing
  }
  return chipLabelByStatus.finished
}
