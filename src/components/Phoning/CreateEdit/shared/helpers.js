const validateGlobalSettings = ({ title, goal, endDate, brief }) => !!title && !!goal && !!endDate && !!brief
const validateCallersAndSurvey = ({ team, survey }) => !!team?.name && !!survey?.name
const validateFilters = ({ firstName, lastName, gender, adherentFromDate, adherentToDate, ageMin, ageMax, zones }) =>
  !!firstName &&
  !!lastName &&
  !!gender &&
  !!adherentFromDate &&
  !!adherentToDate &&
  !!ageMin &&
  !!ageMax &&
  zones?.length > 0

export const validators = {
  globalSettings: validateGlobalSettings,
  callersAndSurvey: validateCallersAndSurvey,
  filters: validateFilters,
}

export const toggleValidStep = (id, isValid) => steps => {
  const validSteps = steps
  const stepIndex = validSteps.findIndex(index => index === id)
  isValid === false && validSteps.includes(id) && validSteps.splice(stepIndex, 1)
  isValid === true && !validSteps.includes(id) && validSteps.push(id)
  return validSteps
}

export const validateAllSteps = data => steps => {
  const allValidators = [validators.globalSettings, validators.callersAndSurvey, validators.filters]
  const validSteps = []
  allValidators.forEach((validate, index) => {
    const isValid = validate(index < 2 ? data : data.filters)
    isValid === true && !steps.includes(index) && validSteps.push(index)
  })
  return validSteps
}
