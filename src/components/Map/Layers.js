export const LayersCodes = {
  region: 'region',
  department: 'departement',
  cantons: 'canton',
  circonscription: 'circonscription',
  communes: 'commune',
  pollingStation: 'bureau',
  ciblagePapPoint: 'ciblage-pap-point',
  ciblagePapLeft: 'ciblage-t2-reserve-gauche',
  ciblagePapRight: 'ciblage-t2-reserve-droite',
  ciblagePapAbstaining: 'ciblage-t2-reserve-abstentionnistes',
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
  [LayersCodes.ciblagePapAbstaining]: "Réserve d'abstentionnistes",
}
