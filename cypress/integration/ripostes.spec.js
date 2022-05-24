import { initialize, mock } from './main.spec'

const GroupCard = '[data-cy="ui-card"]'
const UICard = '[data-cy="ui-card"]'
const Typography = '.MuiTypography-root'
const activateButton = '[data-cy="dot-action-menu"]'

const navigate = () => {
  cy.contains('National').click()
  cy.contains('a', 'Action numérique').click()
  cy.url().should('eq', 'http://localhost:3000/ripostes')
}


describe('Ripostes', () => {
  beforeEach(() => {
    initialize()
    mock('GET', '/api/v3/ripostes?order[created_at]=desc&page=1&page_size=20&scope=national', 'ripostes/ripostes')
    navigate()
  })

  describe('Homepage', () => {
    xit('displays a title', () => {
      cy.contains('Actions numériques')
    })

    xit('displays two cards', () => {
      cy.get(GroupCard).should('have.length', 2)
    })

    describe('The riposte card', () => {
      xit('should contain 3 parts', () => {
        cy.get(UICard).should('exist')
        cy.get(UICard).eq(0).find('>div').should('have.length', 3)
      })

      xit('should show a chip, a date, a title and an author', () => {
        cy.get(UICard).eq(0).find('>div').eq(0).find(Typography).each((element, index) => {
          if (index === 0) cy.wrap(element).should('exist').and('have.text', 'Inactive').and('be.visible')
          if (index === 1) cy.wrap(element).should('exist').and('have.text', new Date(2021, 11, 2, 12, 0).toLocaleDateString()).and('be.visible')
          if (index === 2) cy.wrap(element).should('exist').and('have.text', 'Riposte 2').and('be.visible')
          if (index === 3) cy.wrap(element).should('exist').and('have.text', 'Par author 2').and('be.visible')
        })
      })

      xit('should show kpis', () => {
        cy.get(UICard).eq(0).find('>div').eq(1).find('>div').find('>div').each((element, index) => {
          if (index === 0) cy.wrap(element).should('exist').should('exist')
          if (index === 1) cy.wrap(element).should('exist').and('have.text', '2 vues').and('be.visible')
          if (index === 2) cy.wrap(element).should('exist').and('have.text', '2 vues détaillées').and('be.visible')
          if (index === 3) cy.wrap(element).should('exist').and('have.text', '2 actions numériques').and('be.visible')
        })
      })

      it('should show an edit button and an activate button', () => {
        cy.get(UICard).eq(0).find('>div').eq(2).contains('Éditer')
        cy.get(activateButton).eq(0).should('exist')
      })

      it('should have an activate button', () => {
        cy.get(activateButton).eq(0).click()
        cy.contains('Activer')
      })
    })
  })

    // cy.contains('Éditer').first().click()
    // const modal = 'div[role="dialog"]'
    // cy.get(modal).contains('Modifier une action numérique')
    // cy.get(modal).get('input[name="title"]').should('have.value', 'Riposte 2')
    // cy.get(modal).get('textarea[name="body"]').should('have.value', 'Répondez à Candidat X')
    // cy.get(modal).get('input[name="url"]').should('have.value', 'https://www.en-marche.fr')
    // cy.get(modal + ' button')
    //   .first()
    //   .click()
    // cy.get(modal).should('not.exist')
})
