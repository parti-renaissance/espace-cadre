import { faker } from '@faker-js/faker'

const fakePollingStations = []
let i = 0
let id = 1

for (i; i <= 50; i++) {
  fakePollingStations.push({
    id: faker.datatype.uuid(),
    tag: `#${id++}`,
    name: faker.address.streetName(),
    voters: faker.datatype.number(),
    addresses: faker.datatype.number(),
  })
}

export default fakePollingStations
