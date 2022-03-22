import { initialization } from './main.spec'

const DeleteButton = '[data-cy="dot-action-menu"]'
const MailCard = '[data-cy="email-campaign-card"]'


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
    it('should have a page title', () => {
      cy.contains('Indicateurs')
    })

    it('should have a card with action buttons', () => {
      cy.get(MailCard).eq(1).contains('sujet 1')
      cy.get(MailCard).eq(1).contains('Brouillon')

      cy.get(DeleteButton).click()
      // cy.contains('Supprimer').click()
      // cy.wait(2000)
      // cy.get(MailCard).eq(1).should('not.exist')
    })

    it('should have a card withoud action buttons', () => {
      cy.get(MailCard).first().contains('sujet 2')
      cy.get(MailCard).first().contains('Envoyé')
      cy.get(MailCard).first().contains(`Le ${new Date(2021, 10, 2).toLocaleDateString()}`)

    })

    it('should have a button that redirects to email editor page', () => {
      cy.contains('Envoyer un email').click()
    })
  })

  // describe('Email editor page', () => {

  // })

  
