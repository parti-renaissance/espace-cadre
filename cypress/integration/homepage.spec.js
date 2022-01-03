import { initialization } from './main.spec'

describe('Homepage', () => {
  beforeEach(() => {
    initialization()
  })

  it('loads homepage successfully', () => {
    cy.contains('Député')
    cy.contains('National')
    cy.contains('Responsable Phoning')
    cy.contains('Référent')
  })
})
