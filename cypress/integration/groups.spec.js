import { initialization } from './main.spec'
import { mock } from './main.spec'

describe('Groups', () => {
  beforeEach(() => {
    initialization()
    mock('GET', '/api/v3/teams?*', 'groups/groups')
  })

  it('loads referent groups successfully', () => {
    cy.contains('Référent').click()
    cy.contains('Groupes').click()

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
