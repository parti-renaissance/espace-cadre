import { FeatureEnum } from '~/models/feature.enum'

export const featuresGroup = [
  {
    label: 'Tableau de bord',
    slug: 'dashboard',
    features: [FeatureEnum.DASHBOARD],
  },
  {
    label: 'Communication',
    slug: 'communication',
    features: [
      FeatureEnum.MESSAGES,
      FeatureEnum.NEWS,
      FeatureEnum.DEPARTMENT_SITE,
      FeatureEnum.PHONING_CAMPAIGN,
      FeatureEnum.RIPOSTES,
    ],
  },
  {
    label: 'Militantisme',
    slug: 'militantisme',
    features: [
      FeatureEnum.CONTACTS,
      FeatureEnum.EVENTS,
      FeatureEnum.ACTIONS,
      FeatureEnum.TEAM,
      FeatureEnum.PAP,
      FeatureEnum.PAP_V2,
      FeatureEnum.SURVEY,
      FeatureEnum.ADHERENT_FORMATIONS,
      FeatureEnum.DOCUMENTS,
    ],
  },
  {
    label: 'Élections',
    slug: 'elections',
    features: [FeatureEnum.PROCURATIONS],
  },
  {
    label: 'Gestion territoriale',
    slug: 'gestion_territoriale',
    features: [
      FeatureEnum.ELECTIONS,
      FeatureEnum.ELECTED_REPRESENTATIVE,
      FeatureEnum.COMMITTEE,
      FeatureEnum.GENERAL_MEETING_REPORTS,
      FeatureEnum.MY_TEAM,
      FeatureEnum.STATUTORY_MESSAGE,
    ],
  },
]

export const featuresLabels = {
  [FeatureEnum.DASHBOARD]: 'Vue d’ensemble',
  [FeatureEnum.CONTACTS]: 'Militants',
  [FeatureEnum.CONTACTS_EXPORT]: 'Militants (export)',
  [FeatureEnum.MESSAGES]: 'Messagerie',
  [FeatureEnum.ELECTIONS]: 'Historique élections',
  [FeatureEnum.RIPOSTES]: 'Action numérique',
  [FeatureEnum.TEAM]: 'Groupes',
  [FeatureEnum.NEWS]: 'Notifications',
  [FeatureEnum.PHONING_CAMPAIGN]: 'Phoning',
  [FeatureEnum.PAP]: 'Porte à porte',
  [FeatureEnum.PAP_V2]: 'Porte à porte local',
  [FeatureEnum.SURVEY]: 'Questionnaires',
  [FeatureEnum.MY_TEAM]: 'Mon équipe',
  [FeatureEnum.EVENTS]: 'Événements',
  [FeatureEnum.DEPARTMENT_SITE]: 'Site départemental',
  [FeatureEnum.ELECTED_REPRESENTATIVE]: 'Registre des élus',
  [FeatureEnum.ADHERENT_FORMATIONS]: 'Formations',
  [FeatureEnum.GENERAL_MEETING_REPORTS]: "Centre d'archives",
  [FeatureEnum.COMMITTEE]: 'Comités locaux',
  [FeatureEnum.DOCUMENTS]: 'Documents',
  [FeatureEnum.DESIGNATION]: 'Élections CL',
  [FeatureEnum.STATUTORY_MESSAGE]: 'Emails statutaires',
  [FeatureEnum.PROCURATIONS]: 'Procurations',
  [FeatureEnum.ACTIONS]: 'Actions',
}
