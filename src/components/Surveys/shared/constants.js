import { nationalScopes } from '~/shared/scopes'

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

export const getScopeVisibility = scope => (nationalScopes.includes(scope) ? visibility.national : visibility.local)
