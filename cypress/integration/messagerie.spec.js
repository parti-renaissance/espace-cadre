import { initialization } from './main.spec'

const DeleteButton = '[data-cy="dot-action-menu"]'
const MailCard = '[data-cy="email-campaign-card"]'
const MailObjectInput = '[data-cy="mail-editor-object"]'


  const navigate = () => {
    cy.contains('Référent').click()
    cy.contains('Messagerie').click()
    cy.url().should('eq', 'http://localhost:3000/messagerie')
  }

  beforeEach(() => {
    initialization()
    navigate()
  })

  describe('Messagerie homepage ', () => {
    xit('should have a page title', () => {
      cy.contains('Indicateurs')
    })

    xit('should have a card with action buttons', () => {
      cy.get(MailCard).eq(1).contains('sujet 1')
      cy.get(MailCard).eq(1).contains('Brouillon')

      cy.get(DeleteButton).click()
      // cy.contains('Supprimer').click()

      // cy.get(MailCard).eq(1).should('not.exist')
    })

    it('should have a card withoud action buttons', () => {
      cy.get(MailCard).first().contains('sujet 2')
      cy.get(MailCard).first().contains('Envoyé')
      cy.get(MailCard).first().contains(`Le ${new Date(2021, 10, 2, 12, 0).toLocaleDateString()}`)
    })
  })

  describe('Email editor page', () => {
    it('should have a title', () => {
      cy.contains('Envoyer un email').click()
      cy.contains('Créer un message')
      cy.get(MailObjectInput)
    })
  })

  
