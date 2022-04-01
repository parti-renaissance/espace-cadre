const tocome = 'tocome'
const ongoing = 'ongoing'
const finished = 'finished'

export const chipColorsByStatus = {
  [tocome]: { color: 'red600', bgcolor: '#DC262614' },
  [ongoing]: { color: 'green700', bgcolor: 'campaign.background.chip.ongoing' },
  [finished]: { color: 'gray700', bgcolor: '#37415114' },
}

export const chipLabelByStatus = {
  [tocome]: 'À venir',
  [ongoing]: 'En cours',
  [finished]: 'Terminé',
}
