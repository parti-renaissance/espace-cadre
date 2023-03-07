import { initialize, mock } from './main.cy'

const CommitteesGrid = '[data-cy="committees-grid"]'
const CommitteeCard = '[data-cy="committee-card"]'

const navigate = () => {
  cy.contains('Référent').click()
  cy.contains('Gestion territoriale').click()
  cy.contains('Comités').click()
  cy.url().should('eq', 'http://localhost:3000/comites')
}

describe('Committees', () => {
  beforeEach(() => {
    initialize()
    mock('GET', '/api/v3/committees?page=1&page_size=20&scope=referent', 'committees/committees')
    mock('GET', '/api/v3/committees/5e00c264-1d4b-43b8-862e-29edc38389b3?scope=referent', 'committees/committee')

    navigate()
  })

  describe('the committees list', () => {
    it('can see the committees list', () => {
      cy.get(CommitteesGrid).find(CommitteeCard).children().should('have.length', 1)
    })

    it('should have a "Voir" clickable button ', () => {
      cy.get(CommitteeCard).eq(0).find('button').eq(0).click()
      cy.url().should('eq', 'http://localhost:3000/comites/5e00c264-1d4b-43b8-862e-29edc38389b3')
      cy.contains('Informations')
      cy.contains('Élections')
    })
  })
})
