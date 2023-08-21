import { initialize, mock } from './main.cy'

const UICard = '[data-cy="ui-card"]'
const Typography = '.MuiTypography-root'
const publishedNews = '[data-testid="NotificationsActiveRoundedIcon"]'
const readOnlyModal = '[data-testid="news-read-only-modal"]'
const createModal = '[data-testid="create-modal"]'
const actionButton = '[data-cy="dot-action-menu"]'
const actionButtonOptions = '.MuiList-root'
const closeIcon = '[data-testid="close-icon"]'
const pinnedIcon = '[data-testid="BookmarkIcon"]'
const createNewsButton = '[data-cy="ui-page-header-button"]'
const ckeditor = '.ck-editor'
const callToActionContainer = '[data-testid="callToAction-container"]'
const notificationContainer = '[data-testid="notification-container"]'

const navigate = () => {
  cy.contains('Référent').click()
  cy.contains('Actualités').click()
  cy.url().should('eq', 'http://localhost:3000/actualites')
}

describe('News', () => {
  beforeEach(() => {
    initialize()
    mock('GET', '/api/v3/jecoute/news?order[created_at]=desc&page=1&page_size=20&scope=referent', 'news/news')
    navigate()
  })

  describe('The pinned card section', () => {
    it('should have a title', () => {
      cy.contains('Épinglée dans l’application Je m’engage')
    })
    it('should have a pinned card', () => {
      cy.get(UICard).eq(0).find('>div').eq(0).get(`svg${pinnedIcon}`).should('exist')
    })
  })
  describe('The cards section', () => {
    it('should have a title', () => {
      cy.contains('Dans votre territoire')
    })
    describe('The news card', () => {
      it('should contain 4 parts', () => {
        cy.get(UICard).eq(1).find('>div').eq(0).find(Typography).should('have.length', 4)
      })

      it('should show a status, a title, a creator and a date', () => {
        cy.get(UICard).eq(1).contains('Publiée')
        cy.get(UICard).eq(1).get(publishedNews).should('be.visible')
        cy.get(UICard).eq(1).contains('Titre 1')
        cy.get(UICard).eq(1).contains('M Creator 1')
        cy.get(UICard).eq(1).contains('Le 15/10/2020 à 10:00')
      })

      it('should display an action button with 3 actions', () => {
        cy.get(UICard).eq(1).find(actionButton).click()
        cy.get(actionButtonOptions).eq(1).find('>li').eq(0).contains('Dépublier')
        cy.get(actionButtonOptions).eq(1).find('>li').eq(1).contains('Épingler')
        cy.get(actionButtonOptions).eq(1).find('>li').eq(2).contains('Modifier')
      })
    })
  })

  describe('The readonly modal', () => {
    it('opens a modal in view mode', () => {
      cy.get(UICard).eq(1).find('>div').eq(1).contains('Voir').click()
      cy.get(readOnlyModal).contains('Publiée')
      cy.get(readOnlyModal).get(publishedNews).should('be.visible')
      cy.get(readOnlyModal).contains('Titre 1')
      cy.get(readOnlyModal).contains('M Creator 1')
      cy.get(readOnlyModal).contains('Le 15/10/2020 à 10:00')
      cy.get(readOnlyModal).contains('Texte 1')
      cy.get(readOnlyModal).find('button').eq(1).contains('AvecVous')
      cy.get(readOnlyModal).find('button').eq(2).contains('Dépublier')
    })

    it('close the modal', () => {
      cy.get(UICard).eq(1).find('>div').eq(1).contains('Voir').click()
      cy.get(closeIcon).click()
      cy.get(readOnlyModal, { timeout: 1000 }).should('not.exist')
    })
  })

  describe('The create modal', () => {
    beforeEach(() => {
      cy.get(createNewsButton).find('>button').contains('Nouvelle Actualité')
      cy.get(createNewsButton).find('>button').click()
    })

    describe('displays a modal with a form', () => {
      it('displays a modal title', () => {
        cy.get(createModal).contains('Nouvelle actualité')
      })

      it('displays a title input with a placeholder', () => {
        cy.get(createModal).contains('Titre')
        cy.get('input').eq(0).invoke('attr', 'placeholder').should('contain', 'Donnez un titre à votre actualité')
      })

      it('displays a text editor', () => {
        cy.get(ckeditor).should('exist')
      })

      it('contains a call to action block with two empty inputs', () => {
        cy.get(callToActionContainer).contains('Bouton d’action')
        cy.get(callToActionContainer).find('input').eq(0).invoke('attr', 'placeholder').should('contain', 'https://')
        cy.get(callToActionContainer).find('input').eq(1).invoke('attr', 'placeholder').should('contain', 'Je m’engage')
      })

      it('contains a notification push block with a text and a checkbox', () => {
        cy.get(notificationContainer).find('[name="withNotification"]').should('exist')
        cy.get(notificationContainer).contains('Envoyer une notification push')
      })

      it('contains a submit button', () => {
        cy.get(createModal).contains('Envoyer l’actualité').click()
      })

      it('contains a button to close the modal', () => {
        cy.get(createModal).find('button').eq(0).click()
        cy.get(createModal, { timeout: 1000 }).should('not.exist')
      })
    })
  })
})
