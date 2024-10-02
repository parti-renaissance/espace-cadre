import { FeatureEnum } from '~/models/feature.enum'

export default {
  [FeatureEnum.DASHBOARD]: '/',
  [FeatureEnum.CONTACTS]: '/militants',
  [FeatureEnum.MESSAGES]: '/messagerie',
  [FeatureEnum.ELECTIONS]: '/elections',
  [FeatureEnum.RIPOSTES]: '/ripostes',
  [FeatureEnum.TEAM]: '/groupes',
  [FeatureEnum.NEWS]: '/notifications',
  [FeatureEnum.PHONING_CAMPAIGN]: '/phoning',
  [FeatureEnum.PAP]: '/porte-a-porte',
  [FeatureEnum.PAP_V2]: '/porte-a-porte-legislatives',
  [FeatureEnum.SURVEY]: '/questionnaires',
  [FeatureEnum.MY_TEAM]: '/mon-equipe',
  [FeatureEnum.EVENTS]: '/evenements',
  [FeatureEnum.DEPARTMENT_SITE]: '/site-departemental',
  [FeatureEnum.ELECTED_REPRESENTATIVE]: '/registre-elus',
  [FeatureEnum.ADHERENT_FORMATIONS]: '/formations',
  [FeatureEnum.GENERAL_MEETING_REPORTS]: '/proces-verbal',
  [FeatureEnum.COMMITTEE]: '/comites',
  [FeatureEnum.DOCUMENTS]: '/documents',
  [FeatureEnum.STATUTORY_MESSAGE]: '/mails-statutaires',
  [FeatureEnum.PROCURATIONS]: '/procurations',
  [FeatureEnum.ACTIONS]: '/actions',
  [FeatureEnum.DESIGNATION]: '/votes-et-consultations',
}

export const publicPaths = {
  signup: '/inscription',
  signupConfirm: '/inscription/felicitations',
  logout: '/deconnexion',
  auth: '/auth',
  ppd: '/politique-protection-donnees',
  cguWeb: '/mentions-legales-web',
  cguMobile: '/mentions-legales-mobile',
  cookiesWeb: '/utilisation-cookies-web',
  cookiesMobile: '/utilisation-cookies-mobile',
}
