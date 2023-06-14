const validateGlobalSettings = ({ title, goal, endDate, brief }) => !!title && !!goal && !!endDate && !!brief
const validateCallersAndSurvey = ({ team, survey }) => !!team?.name && !!survey?.name

export const validators = {
  globalSettings: validateGlobalSettings,
  callersAndSurvey: validateCallersAndSurvey,
  filters: () => true,
}

export const toggleValidStep = (id, isValid) => steps => {
  const validSteps = steps
  const stepIndex = validSteps.findIndex(index => index === id)
  isValid === false && validSteps.includes(id) && validSteps.splice(stepIndex, 1)
  isValid === true && !validSteps.includes(id) && validSteps.push(id)
  return validSteps
}

export const validateAllSteps = data => () => {
  const allValidators = [validators.globalSettings, validators.callersAndSurvey, validators.filters]
  const validSteps = []
  allValidators.forEach((validate, index) => {
    let isValid = false
    if (index === 0) {
      isValid = validate(data.global)
    }
    if (index === 1) {
      isValid = validate({ team: data.team, survey: data.survey })
    }
    if (index === 2) {
      isValid = validate(data.filters)
    }
    isValid === true && !validSteps.includes(index) && validSteps.push(index)
  })
  return validSteps
}
