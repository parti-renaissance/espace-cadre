const AddressesData = {
  metadata: {
    count: 2,
    current_page: 1,
    items_per_page: 2,
    last_page: 2,
    total_items: 4,
  },
  items: [
    {
      uuid: 'b1521e3d-d626-4e89-ab8b-fe3e7a756014',
      status: 'ongoing',
      nb_visited_doors: 1,
      building: {
        uuid: '2fbe7b02-944d-4abd-be3d-f9b2944917a9',
        type: 'building',
        address: {
          uuid: 'a0b9231b-9ff5-49b9-aa7a-1d28abbba32f',
          address: 'Rue du Rocher',
          city_name: 'Paris 8ème',
          insee_code: '75108',
          number: '55',
          postal_codes: ['75008'],
        },
      },
      last_passage: '2022-04-04T14:08:27+02:00',
      last_passage_done_by: {
        uuid: 'be993b71-531d-49da-b68b-ad3bb993ef74',
        first_name: 'Adherent 33',
        last_name: 'Fa33ke',
      },
    },
    {
      uuid: '6754155e-6581-48b8-88af-945a57bb82e6',
      status: 'todo',
      nb_visited_doors: 0,
      building: {
        uuid: 'faf30370-80c5-4a46-8c31-f6a361bfa23b',
        type: 'building',
        address: {
          uuid: 'ccfd846a-5439-42ad-85ce-286baf4e7269',
          address: 'Rue du Rocher',
          city_name: 'Paris 8ème',
          insee_code: '75108',
          number: '65',
          postal_codes: ['75008'],
        },
      },
      last_passage: null,
      last_passage_done_by: null,
    },
  ],
}

export default AddressesData
