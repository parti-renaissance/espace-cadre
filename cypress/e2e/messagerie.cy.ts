import { initialize, mock } from './main.cy'

const HeaderButton = '[data-cy="ui-page-header-button"]'
const KPI = '[data-cy="KPI"]'
const KPICard = '[data-cy="KPICard"]'
const MailObjectInput = '[data-cy="mail-object-input"]'
const MailEditorNextButton = '[data-cy="step-button"]'
const UnlayerContainer = '[data-cy="unlayer-container"]'
const TemplatesButton = '[data-cy="templates-button"]'
const TemplatesModal = '[data-cy="messagerie-modal-templates"]'
const TemplatesCardContainer = '[data-cy="messagerie-templates-container"]'
const TemplateCard = '[data-cy="messagerie-template-card"]'
const SendEmail = '[data-cy="send-mail-action"]'
const SendEmailConfirm = '[data-cy="confirm-send-mail"]'
const ConfirmationModal = '[data-cy="send-mail-modal-confirmation"]'

const selectScope = () => {
  cy.contains('Référent').click()
}

describe('Messagerie', () => {
  beforeEach(() => {
    initialize()
    mock('GET', '/api/v3/adherent_messages/kpi?scope=*', 'internal/reportsRatio')
    mock(
      'GET',
      '/api/v3/adherent_messages?order[created_at]=desc&page=1&page_size=20&status=sent&scope=referent',
      'messagerie/messages'
    )
    mock(
      'GET',
      '/api/v3/adherent_messages?order[created_at]=desc&status=draft&pagination=false&scope=referent',
      'messagerie/email_templates'
    )
    selectScope()
    cy.visit('/messagerie')
  })

  describe('Messagerie homepage', () => {
    describe('Dashboard', () => {
      it('Check main part of dashboard', () => {
        cy.get(HeaderButton).find('button').eq(0).should('have.text', 'Écrire un email')

        cy.get(KPI).should('exist')
        cy.get(KPI).find(KPICard).children().should('have.length', 4)

        const contents = [
          { score: '100', subtitle: "Campagnes d'emails", detail: 'Envoyées ces 30 derniers jours' },
          { score: '12.34%', subtitle: 'Ouvertures', detail: '43.21% au national' },
          { score: '42.42%', subtitle: 'Clics', detail: '44.44% au national' },
          { score: '0.11%', subtitle: 'Désabonnements', detail: '12.12% au national' },
        ]

        contents.forEach((content, index) => {
          Object.keys(content).forEach(key => {
            cy.get(KPI).find(KPICard).find('>div').eq(index).findByText(content[key]).should('exist').and('be.visible')
          })
        })
      })
    })

    describe('Display the Templates Email modal', () => {
      beforeEach(() => {
        mock('GET', '/api/v3/email_templates?scope=*', 'messagerie/email_templates')
      })

      it('should display the modal with cards', () => {
        cy.get(TemplatesButton).click()
        cy.get(TemplatesModal)
          .should('exist')
          .then(() => {
            cy.get(TemplatesCardContainer).children().should('have.length', 2)
            cy.get(TemplateCard).eq(0).contains('test template national')
          })
      })
    })
  })

  describe('Email editor page', () => {
    beforeEach(() => {
      cy.visit('/messagerie/creer')
    })

    it('should have a title', () => {
      cy.contains('Choisissez votre type de courriel.')
      cy.findByText('Écrire une newsletter').click()

      cy.findByLabelText('Nom').type('Hello, World')
      cy.findByLabelText('Objet').type('Hello, World')
      cy.findByText('Enregistrer le brouillon').should('exist').and('be.disabled')
      cy.get(MailEditorNextButton).should('exist').and('be.disabled')

      cy.get('[data-cy="unlayer-btn"]').click()

      cy.get(UnlayerContainer).should('exist')
    })
  })

  describe('Filter page', () => {
    beforeEach(() => {
      mock(
        'GET',
        '/api/v3/adherent_messages/11111111-1111-1111-1111-111111111111/content?scope=referent',
        'messagerie/content'
      )
      mock('PUT', '/api/v3/adherent_messages/11111111-1111-1111-1111-111111111111?scope=referent', 'messagerie/message')
      mock('GET', '/api/v3/adherent_messages/11111111-1111-1111-1111-111111111111?scope=referent', 'messagerie/message')
      mock(
        'PUT',
        '/api/v3/adherent_messages/11111111-1111-1111-1111-111111111111/filter?scope=referent',
        'messagerie/filter'
      )
      mock(
        'POST',
        '/api/v3/adherent_messages/11111111-1111-1111-1111-111111111111/send?scope=referent',
        'messagerie/send'
      )
      mock('GET', '/api/v3/filters?feature=messages&scope=referent', 'messagerie/filters')
      mock(
        'GET',
        '/api/v3/zone/autocomplete?types%5B0%5D=borough&types%5B1%5D=canton&types%5B2%5D=city&types%5B3%5D=department&types%5B4%5D=region&types%5B5%5D=country&types%5B6%5D=district&types%5B7%5D=foreign_district&types%5B8%5D=custom&q=Hauts-de-Seine&scope=referent',
        'messagerie/zones'
      )

      cy.visit('/messagerie/11111111-1111-1111-1111-111111111111/modifier')
    })

    it.skip('can use filter', () => {
      cy.get(MailObjectInput).should('not.have.value', undefined)

      cy.get(MailEditorNextButton).should('exist').and('have.text', 'Suivant').click()

      cy.url().should('eq', 'http://localhost:3000/messagerie/11111111-1111-1111-1111-111111111111/filtrer')
      cy.contains('Filtrer mon message')
      cy.get(SendEmail).click()

      cy.get(ConfirmationModal)
        .should('exist')
        .then(() => {
          cy.get(SendEmailConfirm).click()
        })
    })
  })
})
