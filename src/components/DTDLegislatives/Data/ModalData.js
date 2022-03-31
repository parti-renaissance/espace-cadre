import { faker } from '@faker-js/faker'

const PollingStations = []
let i = 0
let id = 1

for (i; i <= 50; i++) {
  PollingStations.push({
    id: faker.datatype.uuid(),
    isChecked: false,
    tag: `#${id++}`,
    name: faker.address.streetName(),
    voters: faker.datatype.number(),
    addresses: faker.datatype.number(),
  })
}

export default PollingStations
