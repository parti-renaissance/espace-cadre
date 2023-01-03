import scopes from 'shared/scopes'

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

export const translatedGender = {
  other: 'Autre',
  male: 'Homme',
  female: 'Femme',
}

export const simpleField = 'simple_field'
export const uniqueChoice = 'unique_choice'
export const multipleChoice = 'multiple_choice'

export const visibility = {
  local: 'local',
  national: 'national',
}

export const scopesVisibility = {
  [scopes.referent]: visibility.local,
  [scopes.correspondent]: visibility.local,
  [scopes.regional_coordinator]: visibility.local,
  [scopes.deputy]: visibility.local,
  [scopes.legislative_candidate]: visibility.local,
  [scopes.national]: visibility.national,
  [scopes.phoning_national_manager]: visibility.national,
  [scopes.pap_national_manager]: visibility.national,
}
