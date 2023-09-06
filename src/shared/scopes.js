const scopes = {
  regional_coordinator: 'regional_coordinator',
  regional_delegate: 'regional_delegate',
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
  [scopes.president_departmental_assembly]: 'AD',
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
    scopes.regional_delegate,
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
