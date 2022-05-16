import { initialize } from './main.spec'

describe('Homepage', () => {
  beforeEach(() => {
    initialize()
  })

  it('loads homepage successfully', () => {
    cy.contains('Député')
    cy.contains('National')
    cy.contains('Responsable Phoning')
    cy.contains('Référent')
  })
})
