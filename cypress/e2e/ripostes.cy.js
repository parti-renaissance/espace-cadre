import { initialize, mock } from './main.cy'

const GroupCard = '[data-cy="ui-card"]'
const UICard = '[data-cy="ui-card"]'
const Typography = '.MuiTypography-root'
const ActivateButton = '[data-cy="dot-action-menu"]'
const CreateRiposteButton = '[data-cy="ui-page-header-button"]'
const CreateEditModal = '[data-cy="create-edit-modal"]'
const Checkbox = '[data-cy="ui-checkbox"]'

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
    it('displays a title', () => {
      cy.contains('Actions numériques')
    })

    it('displays two cards', () => {
      cy.get(GroupCard).should('have.length', 2)
    })

    describe('The riposte card', () => {
      it('should contain 3 parts', () => {
        cy.get(UICard).should('exist')
        cy.get(UICard).eq(0).find('>div').should('have.length', 3)
      })

      it('should show a chip, a title and an author', () => {
        cy.get(UICard)
          .eq(0)
          .find('>div')
          .eq(0)
          .find(Typography)
          .each((element, index) => {
            if (index === 0) {
              cy.wrap(element).should('exist').and('have.text', 'Inactive').and('be.visible')
            }
            if (index === 2) {
              cy.wrap(element).should('exist').and('have.text', 'Riposte 2').and('be.visible')
            }
            if (index === 3) {
              cy.wrap(element).should('exist').and('have.text', 'Par author 2').and('be.visible')
            }
          })
      })

      it('should show kpis', () => {
        cy.get(UICard)
          .eq(0)
          .find('>div')
          .eq(1)
          .find('>div')
          .find('>div')
          .each((element, index) => {
            if (index === 0) {
              cy.wrap(element).should('exist').should('exist')
            }
            if (index === 1) {
              cy.wrap(element).should('exist').and('have.text', '2 vues').and('be.visible')
            }
            if (index === 2) {
              cy.wrap(element).should('exist').and('have.text', '2 vues détaillées').and('be.visible')
            }
            if (index === 3) {
              cy.wrap(element).should('exist').and('have.text', '2 actions numériques').and('be.visible')
            }
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

  describe('The create modal', () => {
    beforeEach(() => {
      cy.get(CreateRiposteButton).find('>button').click()
    })

    it('displays the modal title', () => {
      cy.contains('Créer une action numérique')
    })

    it('displays an empty title input', () => {
      cy.contains('Titre (255 caractères)')
      cy.get('#title').should('be.empty')
    })

    it('displays an empty text input', () => {
      cy.contains('Texte (255 caractères)')
      cy.get('#body').should('be.empty')
    })

    it('displays an empty URL input', () => {
      cy.contains('URL (255 caractères)')
      cy.get('#url').should('be.empty')
    })

    it('displays a Avec notification checkbox', () => {
      cy.contains('Avec notification')
    })

    it('displays a Active checkbox', () => {
      cy.get(Checkbox).eq(1).find('+span').contains('Active')
    })

    it('contains a button to close the modal', () => {
      cy.get(CreateEditModal).find('button').eq(0).click()
      cy.get(CreateEditModal).should('not.exist')
    })
  })

  describe('The edit modal', () => {
    beforeEach(() => {
      cy.get(UICard).eq(0).find('>div').eq(2).contains('Éditer').click()
    })

    it('displays the modal title', () => {
      cy.contains('Modifier une action numérique')
    })

    it('displays a title input', () => {
      cy.contains('Titre (255 caractères)')
      cy.get('#title').should('have.value', 'Riposte 2')
    })

    it('displays a text input', () => {
      cy.contains('Texte (255 caractères)')
      cy.get('#body').should('have.value', 'Répondez à Candidat X')
    })

    it('displays an URL input', () => {
      cy.contains('URL (255 caractères)')
      cy.get('#url').should('have.value', 'https://www.en-marche.fr')
    })

    it('displays a Avec notification checkbox', () => {
      cy.contains('Avec notification')
    })

    it('displays a Active checkbox', () => {
      cy.get(Checkbox).eq(1).find('+span').contains('Active')
    })

    it('contains a button to close the modal', () => {
      cy.get(CreateEditModal).find('button').eq(0).click()
      cy.get(CreateEditModal).should('not.exist')
    })
  })
})
