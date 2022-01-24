export const published = 'published'
export const unpublished = 'unpublished'

export const defaultChipColor = { color: 'gray700', bgcolor: 'campaign.background.chip.default' }
export const chipColorsByStatus = {
  [published]: { color: 'green700', bgcolor: 'campaign.background.chip.sent' },
  [unpublished]: defaultChipColor,
}

export const chipLabelByStatus = {
  [published]: 'Publié',
  [unpublished]: 'Dépublié',
}
