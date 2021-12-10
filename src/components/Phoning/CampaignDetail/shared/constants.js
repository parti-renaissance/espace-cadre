const sent = 'send'
const unsubscribed = 'to-unsubscribe'
const unreachable = 'to-unjoin'
const unanswered = 'not-respond'
const toRemind = 'to-remind'
const refused = 'failed'
const abandoned = 'interrupted-dont-remind'
const interrupted = 'interrupted'
const completed = 'completed'
const isOver = true

export const defaultChipColor = { color: 'gray600', bgcolor: 'gray200' }
export const chipColorsByStatus = {
  [sent]: { color: 'lightBlue700', bgcolor: 'phoning.background.chip.sent' },
  [unsubscribed]: { color: 'yellow500', bgcolor: 'phoning.background.chip.unsubscribed' },
  [unreachable]: defaultChipColor,
  [unanswered]: defaultChipColor,
  [toRemind]: defaultChipColor,
  [refused]: defaultChipColor,
  [abandoned]: defaultChipColor,
  [interrupted]: defaultChipColor,
  [completed]: { color: 'green700', bgcolor: 'phoning.background.chip.completed' },
  [!isOver]: { color: 'green700', bgcolor: 'phoning.background.chip.completed' },
}

export const chipLabelByStatus = {
  [sent]: 'Envoyé',
  [unsubscribed]: 'Désabonné',
  [unreachable]: 'Non joignable',
  [unanswered]: 'Sans réponse',
  [toRemind]: 'A rappeler',
  [refused]: 'Echec',
  [abandoned]: 'Abandonné',
  [interrupted]: 'Interrompu',
  [completed]: 'Complété',
}

export const translatedGender = {
  male: 'Homme',
  female: 'Femme',
}
