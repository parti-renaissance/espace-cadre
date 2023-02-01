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
}

export default scopes

export const nationalScopes = [
  scopes.national,
  scopes.national_communication,
  scopes.pap_national_manager,
  scopes.phoning_national_manager,
]
