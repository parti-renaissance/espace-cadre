import { intervalToDuration } from 'date-fns'
import { multipleChoice, simpleField, uniqueChoice } from './constants'

export const timeDifferenceToString = (startDate, endDate) => {
  const { days, hours, minutes } = intervalToDuration({ start: startDate, end: endDate })
  return `
    ${days ? `${days} j ` : ''}
    ${hours ? `${hours} h ` : ''}
    ${minutes ? `${minutes} min` : ''}
  `
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
