const unsubscribed = 'désabonné'
const sent = 'envoyé'
const completed = 'complété'

export const chipColorsByStatus = {
  [unsubscribed]: { color: 'yellow500', backgroundColor: 'phoning.background.chip.unsubscribed' },
  [sent]: { color: 'lightBlue700', backgroundColor: 'phoning.background.chip.sent' },
  [completed]: { color: 'green700', backgroundColor: 'phoning.background.chip.completed' },
}
