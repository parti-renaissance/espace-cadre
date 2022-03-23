import { initialization } from './main.spec'

const DeleteButton = '[data-cy="dot-action-menu"]'
const MailCard = '[data-cy="email-campaign-card"]'
const MailObjectInput = '[data-cy="mail-object-input"]'
const MailEditorNextButton = '[data-cy="step-button"]'
const Ckeditor = '[data-cy="ckeditor-container"]'

  const navigate = () => {
    cy.contains('Référent').click()
    cy.contains('Messagerie').click()
    cy.url().should('eq', 'http://localhost:3000/messagerie')
  }

  describe('Messagerie homepage ', () => {
    beforeEach(() => {
      initialization()
      navigate()
    })
    
    xit('should have a page title', () => {
      cy.contains('Indicateurs')
    })

    xit('should have a card with action buttons', () => {
      cy.get(MailCard).eq(1).contains('sujet 1')
      cy.get(MailCard).eq(1).contains('Brouillon')

      cy.get(DeleteButton).click()
      cy.contains('Supprimer').click()

    })

    xit('should have a card without action buttons', () => {
      cy.get(MailCard).first().contains('sujet 2')
      cy.get(MailCard).first().contains('Envoyé')
    })
  })

  describe('Email editor page', () => {
    beforeEach(() => {
      initialization()
      navigate()
      cy.contains('Envoyer un email').click()
      cy.url().should('eq', 'http://localhost:3000/messagerie/creer')
    })

    xit('should have a title', () => {
      cy.contains('Créer un message')
    })

    xit('should have an object input', () => {
      cy.get(MailObjectInput).should('exist')
      cy.contains('Objet du mail')
      cy.get(MailObjectInput).type('Hello, World')
    })

    xit('should have a disabled button', () => {
      cy.get(MailEditorNextButton).should('exist').and('have.text', 'Suivant')
      cy.get(MailEditorNextButton).should('be.disabled')
    })

    xit('should have an enabled button', () => {
      cy.get(MailEditorNextButton).invoke('removeAttr', 'disabled')
      cy.get(MailEditorNextButton).should('not.be.disabled')
    })

    xit('should have an email editor', () => {
      cy.get(Ckeditor)
    })
  })

  
