export const LayersCodes = {
  region: 'region',
  department: 'departement',
  cantons: 'canton',
  circonscription: 'circonscription',
  communes: 'commune',
  pollingStation: 'bureau',
  ciblagePapPoint: 'ciblage-pap-point',
  ciblagePapLeft: 'provenance-gauche',
  ciblagePapRight: 'provenance-droite',
}

export const LayersTypes = {
  [LayersCodes.region]: 'Régions',
  [LayersCodes.department]: 'Départements',
  [LayersCodes.cantons]: 'Cantons',
  [LayersCodes.circonscription]: 'Circonscriptions',
  [LayersCodes.communes]: 'Communes',
  [LayersCodes.pollingStation]: 'Bureaux de vote',
  [LayersCodes.ciblagePapPoint]: 'PAP',
  [LayersCodes.ciblagePapLeft]: 'Voix de gauche',
  [LayersCodes.ciblagePapRight]: 'Voix de droite',
}
