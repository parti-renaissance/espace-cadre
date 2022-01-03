import { initialization } from './main.spec'

describe('Groups', () => {
  beforeEach(() => {
    initialization()
  })

  it('loads referent groups successfully', () => {
    cy.contains('Référent').click()
    cy.contains('Groupes').click()

    cy.contains('Group1')
    cy.contains('1 membre')
    cy.contains('Group2')
    cy.contains('42 membres')

    cy.contains('Voir').first().click()
    cy.url().should('eq', 'http://localhost:3000/groupes/11111111-1111-1111-1111-111111111111/editer')
    cy.contains('firstname1 lastname1')
    cy.contains('92100, adhérent(e) depuis le ' + new Date(2019, 5, 1, 12, 0).toLocaleDateString())
  })
})
