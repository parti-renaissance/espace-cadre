const scopes = {
  regional_coordinator: 'regional_coordinator',
  correspondent: 'correspondent',
  deputy: 'deputy',
  senator: 'senator',
  legislative_candidate: 'legislative_candidate',
  national_communication: 'national_communication',
  national: 'national',
  pap_national_manager: 'pap_national_manager',
  pap: 'pap',
  phoning_national_manager: 'phoning_national_manager',
  phoning: 'phoning',
  referent: 'referent',
  president_departmental_assembly: 'president_departmental_assembly',
  animator: 'animator',
}

export default scopes

export const scopesAliases = {
  [scopes.animator]: 'AN',
  [scopes.correspondent]: 'CO',
  [scopes.deputy]: 'DE',
  [scopes.legislative_candidate]: 'LC',
  [scopes.national]: 'NA',
  [scopes.national_communication]: 'NC',
  [scopes.president_departmental_assembly]: 'PaD',
  [scopes.pap_national_manager]: 'RP',
  [scopes.pap]: 'PaP',
  [scopes.phoning_national_manager]: 'RPh',
  [scopes.phoning]: 'PH',
  [scopes.referent]: 'RE',
  [scopes.regional_coordinator]: 'RC',
  [scopes.senator]: 'SE',
}

export const nationalScopes = [
  scopes.national,
  scopes.national_communication,
  scopes.pap_national_manager,
  scopes.phoning_national_manager,
]

export function isZonedScope(code) {
  return [
    scopes.regional_coordinator,
    scopes.correspondent,
    scopes.deputy,
    scopes.senator,
    scopes.legislative_candidate,
    scopes.national_communication,
    scopes.national,
    scopes.pap_national_manager,
    scopes.pap,
    scopes.phoning_national_manager,
    scopes.phoning,
    scopes.referent,
    scopes.president_departmental_assembly,
  ].includes(code)
}
