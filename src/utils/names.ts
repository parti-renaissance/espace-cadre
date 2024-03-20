import { GenderEnum } from '~/models/common.model'

interface ApiPersonModel {
  first_name: string
  last_name: string
}

export const fullName = ({ first_name, last_name }: ApiPersonModel): string => `${first_name} ${last_name}`

export const getInitials = ({ first_name, last_name }: ApiPersonModel): string =>
  `${first_name.substring(0, 1)}${last_name.substring(0, 1)}`

export const guessHumanReadableTitleBasedOnGender = (value: GenderEnum | string): string | undefined => {
  switch (value) {
    case GenderEnum.FEMALE:
      return 'Madame'
    case GenderEnum.MALE:
      return 'Monsieur'
    default:
      return undefined
  }
}
