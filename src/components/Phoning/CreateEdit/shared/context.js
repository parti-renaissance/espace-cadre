import { createContext } from 'react'

export const initialValues = {
  globalSettings: {
    title: '',
    goal: '',
    endDate: '',
    brief: '',
    zone: '',
  },
  callersAndSurvey: {
    team: null,
    survey: null,
  },
  filters: {
    firstName: '',
    lastName: '',
    ageMin: '',
    ageMax: '',
    adherentFromDate: '',
    adherentToDate: '',
    zones: [],
  },
}

export const GlobalSettingsContext = createContext()
export const CallersAndSurveyContext = createContext()
export const FiltersContext = createContext()
