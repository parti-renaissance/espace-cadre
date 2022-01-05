const doorOpen = 'door_open'
const doorClosed = 'door_closed'
const answerToQuestions = 'accept_to_answer'
const DoNotAnswerToQuestions = 'dont_accept_to_answer'
const contactLater = 'contact_later'

export const defaultChipColor = { color: 'gray700', bgcolor: 'campaign.background.chip.default' }
export const chipColorsByStatus = {
  [doorOpen]: defaultChipColor,
  [doorClosed]: defaultChipColor,
  [answerToQuestions]: defaultChipColor,
  [DoNotAnswerToQuestions]: defaultChipColor,
  [contactLater]: defaultChipColor,
}

export const chipLabelByStatus = {
  [doorOpen]: 'Porte ouverte',
  [doorClosed]: 'Porte fermée',
  [answerToQuestions]: 'Complété',
  [DoNotAnswerToQuestions]: 'Refus',
  [contactLater]: 'A recontacter',
}

export const simpleField = 'simple_field'
export const uniqueChoice = 'unique_choice'
export const multipleChoice = 'multiple_choice'
