const doorOpen = 'door_open'
const doorClosed = 'door_closed'
const answerToQuestions = 'accept_to_answer'
const DoNotAnswerToQuestions = 'dont_accept_to_answer'
const contactLater = 'contact_later'
const tocome = 'tocome'
const ongoing = 'ongoing'
const finished = 'finished'

export const defaultChipColor = { color: 'gray700', bgcolor: 'campaign.background.chip.default' }

export const chipColorsByStatus = {
  [doorOpen]: defaultChipColor,
  [doorClosed]: defaultChipColor,
  [answerToQuestions]: defaultChipColor,
  [DoNotAnswerToQuestions]: defaultChipColor,
  [contactLater]: defaultChipColor,
  [tocome]: defaultChipColor,
  [ongoing]: { color: 'green700', bgcolor: 'campaign.background.chip.ongoing' },
  [finished]: defaultChipColor,
}

export const chipLabelByStatus = {
  [doorOpen]: 'Porte ouverte',
  [doorClosed]: 'Porte fermée',
  [answerToQuestions]: 'Complété',
  [DoNotAnswerToQuestions]: 'Refus',
  [contactLater]: 'A recontacter',
  [tocome]: 'À venir',
  [ongoing]: 'En cours',
  [finished]: 'Terminé',
}

export const translatedGender = {
  other: 'Autre',
  male: 'Homme',
  female: 'Femme',
}

export const simpleField = 'simple_field'
export const uniqueChoice = 'unique_choice'
export const multipleChoice = 'multiple_choice'
