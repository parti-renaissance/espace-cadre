import { initialize, mock } from './main.cy'

const HeaderButton = '[data-cy="ui-page-header-button"]'
const KPI = '[data-cy="KPI"]'
const KPICard = '[data-cy="KPICard"]'
const Typography = '.MuiTypography-root'
const Campaigns = '[data-cy="sent-campaigns-container"]'
const Card = '[data-cy="email-campaign-card"]'
const MailObjectInput = '[data-cy="mail-object-input"]'
const MailEditorNextButton = '[data-cy="step-button"]'
const Ckeditor = '[data-cy="ckeditor-container"]'
const TemplatesButton = '[data-cy="templates-button"]'
const TemplatesModal = '[data-cy="messagerie-modal-templates"]'
const TemplatesCardContainer = '[data-cy="messagerie-templates-container"]'
const TemplateCard = '[data-cy="messagerie-template-card"]'
const SendEmail = '[data-cy="send-mail-action"]'
const SendEmailConfirm = '[data-cy="confirm-send-mail"]'
const ConfirmationModal = '[data-cy="send-mail-modal-confirmation"]'

const navigate = () => {
  cy.contains('Référent').click()
  cy.contains('Messagerie').click()
  cy.url().should('eq', 'http://localhost:3000/messagerie')
}

const moveToEditor = () => {
  cy.get(Card).eq(1).contains('Modifier').click()
  cy.url().should('eq', 'http://localhost:3000/messagerie/11111111-1111-1111-1111-111111111111/modifier')
}

describe('Messagerie', () => {
  beforeEach(() => {
    initialize()
    mock('GET', '/api/v3/adherent_messages/kpi?scope=*', 'internal/reportsRatio')
    mock(
      'GET',
      '/api/v3/adherent_messages?order[created_at]=desc&page=1&page_size=20&scope=referent',
      'messagerie/messages'
    )
    navigate()
  })

  describe('Messagerie homepage ', () => {
    describe('The header', () => {
      it('should have a page title', () => {
        cy.contains('Indicateurs')
      })
      it('should have a button', () => {
        cy.get(HeaderButton).find('button').eq(1).should('have.text', 'Envoyer un email')
      })
    })

    describe('The KPI block', () => {
      it('should contain 2 parts', () => {
        cy.get(KPI).should('exist')
        cy.get(KPI).find('>div').should('have.length', 2)
      })
      it('should have a title', () => {
        cy.get(KPI).find(Typography).first().should('have.text', 'Indicateurs').and('be.visible')
      })
      it('should have 4 cards', () => {
        cy.get(KPI).find(KPICard).children().should('have.length', 4)
      })

      describe('The KPI Cards', () => {
        describe('The campaigns Card count', () => {
          it('should contain 3 parts', () => {
            cy.get(KPI).find(KPICard).find('>div').eq(0).find(Typography).should('have.length', 3)
          })
          it('should show a score, a subtitle and its detail', () => {
            cy.get(KPI)
              .find(KPICard)
              .find('>div')
              .eq(0)
              .find(Typography)
              .each((element, index) => {
                const content = {
                  score: '100',
                  subtitle: "Campagnes d'e-mails",
                  detail: 'Envoyées ces 30 derniers jours',
                }
                if (index === 0) {
                  cy.wrap(element).should('exist').and('have.text', content.score).and('be.visible')
                }
                if (index === 1) {
                  cy.wrap(element).should('exist').and('have.text', content.subtitle).and('be.visible')
                }
                if (index === 2) {
                  cy.wrap(element).should('exist').contains(content.detail).and('be.visible')
                }
              })
          })
        })

        describe('The opening rate Card', () => {
          it('should contain 3 parts', () => {
            cy.get(KPI).find(KPICard).find('>div').eq(1).find(Typography).should('have.length', 3)
          })
          it('should show a score, a subtitle and its detail', () => {
            cy.get(KPI)
              .find(KPICard)
              .find('>div')
              .eq(1)
              .find(Typography)
              .each((element, index) => {
                const content = { score: '12.34%', subtitle: 'Ouvertures', detail: '43.21% au national' }
                if (index === 0) {
                  cy.wrap(element).should('exist').and('have.text', content.score).and('be.visible')
                }
                if (index === 1) {
                  cy.wrap(element).should('exist').and('have.text', content.subtitle).and('be.visible')
                }
                if (index === 2) {
                  cy.wrap(element).should('exist').contains(content.detail).and('be.visible')
                }
              })
          })
        })

        describe('The click Card', () => {
          it('should contain 3 parts', () => {
            cy.get(KPI).find(KPICard).find('>div').eq(2).find(Typography).should('have.length', 3)
          })
          it('should show a score, a subtitle and its detail', () => {
            cy.get(KPI)
              .find(KPICard)
              .find('>div')
              .eq(2)
              .find(Typography)
              .each((element, index) => {
                const content = { score: '42.42%', subtitle: 'Clics', detail: '44.44% au national' }
                if (index === 0) {
                  cy.wrap(element).should('exist').and('have.text', content.score).and('be.visible')
                }
                if (index === 1) {
                  cy.wrap(element).should('exist').and('have.text', content.subtitle).and('be.visible')
                }
                if (index === 2) {
                  cy.wrap(element).should('exist').contains(content.detail).and('be.visible')
                }
              })
          })
        })

        describe('The unsubscribe Card', () => {
          it('should contain 3 parts', () => {
            cy.get(KPI).find(KPICard).find('>div').eq(3).find(Typography).should('have.length', 3)
          })
          it('should show a score, a subtitle and its detail', () => {
            cy.get(KPI)
              .find(KPICard)
              .find('>div')
              .eq(3)
              .find(Typography)
              .each((element, index) => {
                const content = { score: '0.11%', subtitle: 'Désabonnements', detail: '12.12% au national' }
                if (index === 0) {
                  cy.wrap(element).should('exist').and('have.text', content.score).and('be.visible')
                }
                if (index === 1) {
                  cy.wrap(element).should('exist').and('have.text', content.subtitle).and('be.visible')
                }
                if (index === 2) {
                  cy.wrap(element).should('exist').contains(content.detail).and('be.visible')
                }
              })
          })
        })
      })
    })

    describe('The sent campaigns', () => {
      it('should have a title', () => {
        cy.get(Campaigns).find(Typography).first().should('have.text', 'Vos dernières campagnes').and('be.visible')
      })
      it('should have 2 cards', () => {
        cy.get(Campaigns).find(Card).children().should('have.length', 2)
      })

      it('should have a card with action buttons', () => {
        cy.get(Card).eq(1).contains('sujet 1')
        cy.get(Card).eq(1).contains('Brouillon')
        cy.get(Card).eq(1).contains('Modifier')
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
      cy.contains('Envoyer un email').click()
      cy.url().should('eq', 'http://localhost:3000/messagerie/creer')
    })

    it('should have a title', () => {
      cy.contains('Créer un message')
    })

    it('should have an object input', () => {
      cy.get(MailObjectInput).should('exist')
      cy.contains('Objet du mail')
      cy.get(MailObjectInput).type('Hello, World')
    })

    it('should have a disabled button', () => {
      cy.get(MailEditorNextButton).should('exist').and('have.text', 'Suivant')
      cy.get(MailEditorNextButton).should('be.disabled')
    })

    it('should have an email editor', () => {
      cy.get(Ckeditor)
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
      moveToEditor()
    })

    it('can update message', () => {
      cy.contains('Créer un message')
    })

    it('can use filter', () => {
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
