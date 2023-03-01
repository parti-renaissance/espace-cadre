const features = {
  dashboard: 'dashboard',
  contacts: 'contacts',
  messages: 'messages',
  elections: 'elections',
  ripostes: 'ripostes',
  team: 'team',
  news: 'news',
  phoning_campaign: 'phoning_campaign',
  pap: 'pap',
  pap_v2: 'pap_v2',
  survey: 'survey',
  my_team: 'my_team',
  events: 'events',
  adherent_formations: 'adherent_formations',
  department_site: 'department_site',
  elected_representative: 'elected_representative',
  general_meeting_reports: 'general_meeting_reports',
  committee: 'committee',
  documents: 'documents',
}

export default features

export const featuresGroup = [
  {
    label: 'Tableau de bord',
    slug: 'dashboard',
    features: [features.dashboard],
  },
  {
    label: 'Communication',
    slug: 'communication',
    features: [
      features.messages,
      features.news,
      features.department_site,
      features.phoning_campaign,
      features.ripostes,
    ],
  },
  {
    label: 'Militantisme',
    slug: 'militantisme',
    features: [
      features.contacts,
      features.events,
      features.team,
      features.pap,
      features.pap_v2,
      features.survey,
      features.adherent_formations,
      features.general_meeting_reports,
      features.documents,
    ],
  },
  {
    label: 'Gestion territoriale',
    slug: 'gestion_territoriale',
    features: [features.elections, features.elected_representative, features.committee, features.my_team],
  },
]

export const featuresLabels = {
  [features.dashboard]: 'Vue d’ensemble',
  [features.contacts]: 'Militants',
  [features.messages]: 'Messagerie',
  [features.elections]: 'Historique élections',
  [features.ripostes]: 'Action numérique',
  [features.team]: 'Groupes',
  [features.news]: 'Actualités',
  [features.phoning_campaign]: 'Phoning',
  [features.pap]: 'Porte à porte',
  [features.pap_v2]: 'Porte à porte local',
  [features.survey]: 'Questionnaires',
  [features.my_team]: 'Mon équipe',
  [features.events]: 'Évènements',
  [features.department_site]: 'Site départemental',
  [features.elected_representative]: 'Registre des élus',
  [features.adherent_formations]: 'Formations',
  [features.general_meeting_reports]: "Centre d'archives",
  [features.committee]: 'Comités',
  [features.documents]: 'Documents',
}
