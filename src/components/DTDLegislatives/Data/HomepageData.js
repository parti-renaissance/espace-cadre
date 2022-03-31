import { faker } from '@faker-js/faker'

const HomepageData = []
let i = 0
let id = 1

for (i; i <= 20; i++) {
  HomepageData.push({
    id: faker.datatype.uuid(),
    title: faker.lorem.sentence(6),
    author: faker.name.findName(),
    startDate: faker.date.soon(),
    endDate: faker.date.soon(),
    voters: faker.datatype.number({ min: 10, max: 10000 }),
    pollingStations: faker.datatype.number({ min: 10, max: 100 }),
    knockedDoors: faker.datatype.number({ min: 10, max: 100 }),
    filledSurveys: faker.datatype.number({ min: 10, max: 100 }),
    collectedContacts: faker.datatype.number({ min: 10, max: 100 }),
  })
}

export default HomepageData
