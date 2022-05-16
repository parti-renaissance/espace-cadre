import { initialization, mock } from './main.spec'

const navigate = () => {
  cy.contains('Référent').click()
  cy.contains('a', 'Groupes').click()
  cy.url().should('eq', 'http://localhost:3000/groupes')
}

describe('Groups', () => {
  beforeEach(() => {
    initialization()
    mock('GET', '/api/v3/teams?*', 'groups/groups')
    mock('GET', '/api/v3/teams/11111111-1111-1111-1111-111111111111?scope=referent', 'groups/1')
    navigate()
  })

  it('loads referent groups successfully', () => {
    cy.contains('Group1')
    cy.contains('1 militant')
    cy.contains('Group2')
    cy.contains('42 militants')

    cy.contains('Voir').first().click()
    cy.url().should('eq', 'http://localhost:3000/groupes/11111111-1111-1111-1111-111111111111/editer')
    cy.contains('firstname1 lastname1')
    cy.contains('92100, militant(e) depuis le ' + new Date(2019, 5, 1, 12, 0).toLocaleDateString())
  })
})
