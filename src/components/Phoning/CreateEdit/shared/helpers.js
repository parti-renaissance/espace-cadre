export const isStep1Valid = ({ title, goal, endDate, brief }) => !!title && !!goal && !!endDate && !!brief
export const isStep2Valid = ({ team, survey }) => !!team?.name && !!survey?.name
export const isStep3Valid = ({
  firstName,
  lastName,
  gender,
  adherentFromDate,
  adherentToDate,
  ageMin,
  ageMax,
  zones,
}) =>
  !!firstName &&
  !!lastName &&
  !!gender &&
  !!adherentFromDate &&
  !!adherentToDate &&
  !!ageMin &&
  !!ageMax &&
  zones?.length > 0

export const toggleValidStep = (id, isValid) => steps => {
  const validSteps = steps
  const stepIndex = validSteps.findIndex(index => index === id)
  isValid === false && validSteps.includes(id) && validSteps.splice(stepIndex, 1)
  isValid === true && !validSteps.includes(id) && validSteps.push(id)
  return validSteps
}

export const validateAllSteps = data => steps => {
  const validators = [isStep1Valid, isStep2Valid, isStep3Valid]
  const validSteps = []
  validators.forEach((validate, index) => {
    const isValid = validate(index < 2 ? data : data.filters)
    isValid === true && !steps.includes(index) && validSteps.push(index)
  })
  return validSteps
}
