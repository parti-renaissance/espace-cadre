import { initialization } from './main.spec'

describe('Activists', () => {
  beforeEach(() => {
    initialization()
  })

  it('loads "activists" page successfully', () => {
    cy.contains('Référent').click()
    cy.contains('Militants').click()
  })
})
