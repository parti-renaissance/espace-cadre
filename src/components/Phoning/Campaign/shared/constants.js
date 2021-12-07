const sent = 'send'
const unsubscribed = 'to-unsubscribe'
const unreachable = 'to-unjoin'
const unanswered = 'not-respond'
const toRemind = 'to-remind'
const refused = 'failed'
const abandoned = 'interrupted-dont-remind'
const interrupted = 'interrupted'
const completed = 'completed'

export const chipColorsByStatus = {
  [sent]: { color: 'lightBlue700', backgroundColor: 'phoning.background.chip.sent' },
  [unsubscribed]: { color: 'yellow500', backgroundColor: 'phoning.background.chip.unsubscribed' },
  [unreachable]: { color: 'gray600', backgroundColor: 'gray200' },
  [unanswered]: { color: 'gray600', backgroundColor: 'gray200' },
  [toRemind]: { color: 'gray600', backgroundColor: 'gray200' },
  [refused]: { color: 'gray600', backgroundColor: 'gray200' },
  [abandoned]: { color: 'gray600', backgroundColor: 'gray200' },
  [interrupted]: { color: 'gray600', backgroundColor: 'gray200' },
  [completed]: { color: 'green700', backgroundColor: 'phoning.background.chip.completed' },
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
