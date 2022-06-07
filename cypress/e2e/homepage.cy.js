import { initialize } from './main.cy'

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
