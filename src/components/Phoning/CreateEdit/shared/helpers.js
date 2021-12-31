export const isStep1Valid = ({ title, goal, endDate, brief }) => !!title && !!goal && !!endDate && !!brief
export const isStep2Valid = ({ team, survey }) => !!team.name && !!survey.name
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
