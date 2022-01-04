import { intervalToDuration } from 'date-fns'
import { multipleChoice, simpleField, uniqueChoice } from './constants'

export const secondsToMinutesAndSeconds = seconds => {
  const minutes = Math.floor(seconds / 60)
  return `
		${minutes > 0 ? `${minutes} min` : ''}
		${seconds % 60 > 0 ? seconds % 60 : ''}
	`
}

export const campaignToGlobalSettingsValues = campaign => ({
  title: campaign.title ?? '',
  goal: campaign.goal ?? '',
  endDate: campaign.endDate ?? '',
  brief: campaign.brief ?? '',
})

export const campaignToCallersAndSurveyValues = campaign => ({
  team: campaign.team ?? null,
  survey: campaign.survey ?? null,
})

export const campaignToFiltersValues = campaign => ({
  firstName: campaign.filters?.firstName ?? '',
  lastName: campaign.filters?.lastName ?? '',
  gender: campaign.filters?.gender ?? '',
  adherentFromDate: campaign.filters?.adherentFromDate ?? '',
  adherentToDate: campaign.filters?.adherentToDate ?? '',
  ageMin: campaign.filters?.ageMin ?? '',
  ageMax: campaign.filters?.ageMax ?? '',
  certified: campaign.filters?.certified ?? false,
  committeeMember: campaign.filters?.committeeMember ?? false,
  emailSubscribed: campaign.filters?.emailSubscribed ?? false,
  SMSSubscribed: campaign.filters?.SMSSubscribed ?? false,
  zones: campaign.filters?.zones ?? [],
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
