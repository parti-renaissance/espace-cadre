import { apiClient } from '../services/networking/client'

import ElectionResult from '../components/Elections/ElectionResult';

const formatElectionResults = (results = []) => results.map(({
    nuance,
    code_couleur: colorCode,
    prenom: firstname,
    nom: lastname,
    voix: votesCount,
  }) => new ElectionResult(nuance, colorCode, firstname, lastname, votesCount )
);

export const getElectionResults = async (query, updater) => {
  const url = `/election/results?${query}`;
  const data = await apiClient.get(url);
  const result = formatElectionResults(data);
  updater && updater(result);
};
