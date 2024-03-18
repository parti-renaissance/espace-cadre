import { ActivistTagEnum } from '~/models/activist.model'
import { tagsColor } from '~/theme/palette'

export const activistTagShape = {
  [ActivistTagEnum.ADHERENT]: {
    color: tagsColor.variant1Text,
    bgColor: tagsColor.variant1Background,
  },
  [ActivistTagEnum.SYMPATHISANT]: {
    color: tagsColor.variant2Text,
    bgColor: tagsColor.variant2Background,
  },
  [ActivistTagEnum.ELU]: {
    color: tagsColor.variant3Text,
    bgColor: tagsColor.variant3Background,
  },
}
