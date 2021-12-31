import { initialization } from './main.spec'

describe('Adherents', () => {
  beforeEach(() => {
    initialization()
  })

  it('loads "adherents" page successfully', () => {
    cy.contains('Référent').click()
    cy.contains('Adhérents').click()
  })
})
