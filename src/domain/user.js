export default class {
  constructor(id, firstName, lastName) {
    this.id = id
    this.firstName = firstName
    this.lastName = lastName
  }

  toObject = () => ({
    id: this.id,
    firstName: this.firstName,
    lastName: this.lastName,
  })
}
