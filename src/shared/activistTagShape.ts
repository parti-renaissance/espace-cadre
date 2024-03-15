import { ActivistTagEnum } from '~/models/activist.model'

export const activistTagShape = {
  [ActivistTagEnum.ADHERENT]: {
    // color: '#0D6A9C',
    // bgColor: '#C2E1FF',
    variant: 'outlined',
  },
  [ActivistTagEnum.SYMPATHISANT]: {
    // color: 'white',
    // bgColor: 'red',
    variant: '#919EAB29',
  },
  [ActivistTagEnum.ELU]: {
    // color: '#637381',
    variant: '#919EAB29',
  },
}
