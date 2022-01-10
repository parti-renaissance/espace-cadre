import { multipleChoice, simpleField, uniqueChoice } from './constants'

export const secondsToMinutes = seconds => (Number.isInteger(seconds) ? `${Math.floor(seconds / 60)} min` : null)

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
