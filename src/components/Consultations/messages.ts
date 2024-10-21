import { DesignationTypeEnum } from '~/domain/designation'

export const messages = {
  [DesignationTypeEnum.Consultation]: {
    step1: "Création d'une nouvelle consultation",
    item: 'question',
    modal: {
      cancel: {
        title: 'Annulation de la consultation',
        content: 'Êtes-vous sûr de vouloir annuler la consultation ?',
      },
    },
    notification: {
      save_success: 'La consultation a été enregistrée',
      cancel_success: 'La consultation a été annulée',
    },
  },
  [DesignationTypeEnum.Vote]: {
    step1: "Création d'un nouveau vote",
    item: 'résolution',
    modal: {
      cancel: {
        title: 'Annulation du vote',
        content: 'Êtes-vous sûr de vouloir annuler le vote ?',
      },
    },
    notification: {
      save_success: 'Le vote a été enregistré',
      cancel_success: 'Le vote a été annulé',
    },
  },
  notification: {
    not_found: "La consultation / vote n'existe pas 🤷",
  },
}
