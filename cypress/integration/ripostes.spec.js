import { initialize, mock } from './main.spec'

const GroupCard = '[data-cy="ui-card"]'
const UICard = '[data-cy="ui-card"]'
const Typography = '.MuiTypography-root'
const ActivateButton = '[data-cy="dot-action-menu"]'
const CreateRiposteButton = '[data-cy="ui-page-header-button"]'
const CreateEditModal = '[data-cy="create-edit-modal"]'

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

    describe.skip('The riposte card', () => {
      it('should contain 3 parts', () => {
        cy.get(UICard).should('exist')
        cy.get(UICard).eq(0).find('>div').should('have.length', 3)
      })

      it('should show a chip, a date, a title and an author', () => {
        cy.get(UICard).eq(0).find('>div').eq(0).find(Typography).each((element, index) => {
          if (index === 0) cy.wrap(element).should('exist').and('have.text', 'Inactive').and('be.visible')
          if (index === 1) cy.wrap(element).should('exist').and('have.text', new Date(2021, 11, 2, 12, 0).toLocaleDateString()).and('be.visible')
          if (index === 2) cy.wrap(element).should('exist').and('have.text', 'Riposte 2').and('be.visible')
          if (index === 3) cy.wrap(element).should('exist').and('have.text', 'Par author 2').and('be.visible')
        })
      })

      it('should show kpis', () => {
        cy.get(UICard).eq(0).find('>div').eq(1).find('>div').find('>div').each((element, index) => {
          if (index === 0) cy.wrap(element).should('exist').should('exist')
          if (index === 1) cy.wrap(element).should('exist').and('have.text', '2 vues').and('be.visible')
          if (index === 2) cy.wrap(element).should('exist').and('have.text', '2 vues détaillées').and('be.visible')
          if (index === 3) cy.wrap(element).should('exist').and('have.text', '2 actions numériques').and('be.visible')
        })
      })

      it('should show an edit button and an activate button', () => {
        cy.get(UICard).eq(0).find('>div').eq(2).contains('Éditer')
        cy.get(ActivateButton).eq(0).should('exist')
      })

      it('should have an activate button', () => {
        cy.get(ActivateButton).eq(0).click()
        cy.contains('Activer')
      })
    })
  })

  describe('The create or edit modal', () => {
    beforeEach(() => {
      cy.get(CreateRiposteButton).find('>button').click()
    })

    it('displays an empty modal with a form', () => {
      cy.contains('Créer une action numérique')
      cy.contains('Titre (255 caractères)')
      cy.contains('Texte (255 caractères)')
      cy.contains('URL (255 caractères)')
    })
  })  
})
