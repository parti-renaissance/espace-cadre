import { ActivistTagEnum } from '~/models/activist.model'

export const activistTagShape = {
  [ActivistTagEnum.ADHERENT]: {
    color: '#C2E1FF',
  },
  [ActivistTagEnum.SYMPATHISANT]: {
    color: '#C2E1FF',
  },
  [ActivistTagEnum.ELU]: {
    color: '#C2E1FF',
    variant: 'outlined',
  },
}
