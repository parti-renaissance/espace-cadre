export const ElectionFirstStage = '1';
export const ElectionSecondStage = '2';

export const LayersCodes = {
  region: 'region',
  department: 'departement',
  cantons: 'canton',
  circonscription: 'circonscription',
  communes: 'commune',
  pollingStation: 'bureau',
};

export const LayersTypes = {
  [LayersCodes.region]: 'Régions',
  [LayersCodes.department]: 'Départements',
  [LayersCodes.cantons]: 'Cantons',
  [LayersCodes.circonscription]: 'Circonscriptions',
  [LayersCodes.communes]: 'Communes',
  [LayersCodes.pollingStation]: 'Bureaux de vote',
};

export const ElectionTypes = {
  Presidential: 'Présidentielles',
  Departemental: 'Départementales',
  Legislative: 'Législatives',
  Regional: 'Régionales',
  European: 'Européennes',
  Municipal: 'Municipales',
};

export const ElectionDetails = [
  {
      label: ElectionTypes.European,
      year: 2014,
      rounds: 1,
  },
  {
      label: ElectionTypes.Departemental,
      year: 2015,
      rounds: 2,
  },
  {
      label: ElectionTypes.Regional,
      year: 2015,
      rounds: 2,
  },
  {
      label: ElectionTypes.Presidential,
      year: 2017,
      rounds: 2,
  },
  {
      label: ElectionTypes.Legislative,
      year: 2017,
      rounds: 2,
  },
  {
      label: ElectionTypes.European,
      year: 2019,
      rounds: 1,
  },
  {
      label: ElectionTypes.Municipal,
      year: 2020,
      rounds: 2,
  },
  {
      label: ElectionTypes.Regional,
      year: 2021,
      rounds: 2,
  },
  {
      label: ElectionTypes.Departemental,
      year: 2021,
      rounds: 2,
  },
];
