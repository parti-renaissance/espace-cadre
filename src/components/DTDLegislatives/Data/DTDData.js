import { faker } from '@faker-js/faker'

const DTDData = []
let i = 0

for (i; i < 20; i++) {
  DTDData.push({
    id: faker.datatype.uuid(),
    number: i,
    author: faker.name.findName(),
    count: faker.datatype.number({ min: 5, max: 50 }),
    goal: faker.datatype.number({ min: 50, max: 100 }),
  })
}

export default DTDData
