const messages = {
  female: 'Femme',
  male: 'Homme',
  other: 'Autre',
}

export const months = [
  { key: '01', value: 'Janvier' },
  { key: '02', value: 'Février' },
  { key: '03', value: 'Mars' },
  { key: '04', value: 'Avril' },
  { key: '05', value: 'Mai' },
  { key: '06', value: 'Juin' },
  { key: '07', value: 'Juillet' },
  { key: '08', value: 'Aout' },
  { key: '09', value: 'Septembre' },
  { key: '10', value: 'Octobre' },
  { key: '11', value: 'Novemvre' },
  { key: '12', value: 'Décembre' },
]
export const currentYear = new Date().getFullYear()
export const years = (() =>
  new Array(120)
    .fill('')
    .map((_, y) => String(currentYear - y))
    .map(year => ({ key: year, value: year })))()

export const genders = [
  { key: 'female', value: messages.female },
  { key: 'male', value: messages.male },
  { key: 'other', value: messages.other },
]
