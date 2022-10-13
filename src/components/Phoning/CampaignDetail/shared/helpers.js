import { intervalToDuration } from 'date-fns'
import { multipleChoice, simpleField, uniqueChoice } from './constants'

export const secondsToMinutesAndSeconds = seconds => {
  const minutes = Math.floor(seconds / 60)
  const textInMinutes = minutes > 0 ? `${minutes} min` : ''
  const textInSeconds = seconds % 60 > 0 ? seconds % 60 : ''
  return textInMinutes || textInSeconds ? `${textInMinutes}${textInSeconds}` : 0
}

export const campaignToGlobalSettingsValues = ({ title, goal, endDate, brief, zone }) => ({
  title: title ?? '',
  goal: goal ?? '',
  endDate: endDate ?? '',
  brief: brief ?? '',
  zone: zone ?? '',
})

export const campaignToCallersAndSurveyValues = ({ team, survey }) => ({
  team: team ?? null,
  survey: survey ?? null,
})

export const campaignToFiltersValues = ({
  firstName,
  lastName,
  gender,
  adherentFromDate,
  adherentToDate,
  ageMin,
  ageMax,
  certified,
  committeeMember,
  emailSubscribed,
  SMSSubscribed,
  isRenaissanceMembership,
  zones,
}) => ({
  firstName: firstName ?? '',
  lastName: lastName ?? '',
  gender: gender ?? '',
  adherentFromDate: adherentFromDate ?? '',
  adherentToDate: adherentToDate ?? '',
  ageMin: ageMin ?? '',
  ageMax: ageMax ?? '',
  certified: certified ?? null,
  committeeMember: committeeMember ?? null,
  emailSubscribed: emailSubscribed ?? null,
  SMSSubscribed: SMSSubscribed ?? true,
  isRenaissanceMembership:
    typeof isRenaissanceMembership === 'undefined' || isRenaissanceMembership === null ? '' : isRenaissanceMembership,
  zones: zones ?? [],
})

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
