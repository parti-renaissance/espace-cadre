import { faker } from '@faker-js/faker'

const buildingTypes = ['Immeuble', 'Maison']
const statusItems = ['A faire', 'En cours', 'Terminé']
const AddressesData = {
  items: [],
}
let i = 0

for (i; i < 10; i++) {
  AddressesData.items.push({
    address: `${faker.address.streetAddress()}, ${faker.address.zipCode('#####')} ${faker.address.city()}`,
    buildingType: buildingTypes[Math.round(Math.random())],
    status: statusItems[Math.floor(Math.random() * 3)],
    doorsKnocked: Math.floor(Math.random() * 500),
    questioner: {
      uuid: faker.datatype.uuid(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      age: Math.floor(Math.random() * 100),
      gender: 'male',
    },
  })
}

export default AddressesData
