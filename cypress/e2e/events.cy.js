import { initialize, mock } from './main.cy'

const Tabs = '.MuiTabs-root'
const UICard = '[data-cy="ui-card"]'
const DotMenu = '[data-cy="dot-action-menu"]'
const BadgeStatus = '[data-cy="badge-status"]'
const PageHeaderButton = '[data-cy="ui-page-header-button"]'
const PageHeaderTitle = '[data-cy="ui-page-header"]'
const Modale = '.MuiDialog-paper[role="dialog"]'
const InputName = 'input[name="name"]'
const Select = '.MuiSelect-select'
const Typography = '.MuiTypography-root'

describe('Events', () => {
  beforeEach(() => {
    initialize()
    mock('GET', '/api/v3/events?order*=desc&page=1&page_size=20&scope=*', 'events/events')
    mock('GET', '/api/v3/events?order*=desc&page=1&page_size=20&only_mine&scope=*', 'events/myevents')
    mock('GET', '/api/v3/events/11111111-1111-1111-1111-111111111111?scope=*', 'events/event')
    mock('GET', '/api/v3/events/11111111-1111-1111-1111-111111111111/participants?page=1&scope=*', 'events/attendees')
    mock('GET', '/api/event_categories', 'events/categories')

    cy.contains('Référent').click()
    cy.visit('/evenements')
  })

  describe('The header', () => {
    it('should have a title', () => {
      cy.get(PageHeaderTitle).should('exist')
      cy.get(PageHeaderTitle).find('>div').find(Typography).first().should('have.text', 'Événements').and('be.visible')
    })

    it('should have a clickable action button', () => {
      cy.get(PageHeaderButton).should('exist').as('Button')

      cy.get('@Button').find('button').should('have.text', 'Créer un événement')
    })
  })

  describe('Page events', () => {
    it('should contain 2 tabs', () => {
      cy.get(Tabs).contains('Tout')
      cy.get(Tabs).contains('Mes événements')
    })

    it('should display 2 events', () => {
      cy.get(Tabs).contains('Tout').click()

      cy.get(UICard).eq(0).contains('evenement 1')
      cy.get(UICard).eq(1).contains('evenement 2')

      cy.get(UICard).eq(0).contains('42')
      // cy.get(UICard).eq(0).get(BadgeStatus).contains('Passé')
      cy.get(UICard).eq(0).contains('Par Prénom1 Nom1')
      cy.get(UICard).eq(0).contains('17 janvier 2022')
      cy.get(UICard).eq(0).contains('17 rue du XXXX, 95000 Jolie-Ville')

      cy.get(UICard).eq(1).contains('1')
      // cy.get(UICard).eq(1).get(BadgeStatus).contains('Annulé')
      cy.get(UICard).eq(1).contains('Par Prénom2 Nom2')
      cy.get(UICard).eq(1).contains('18 janvier 2022')
      cy.get(UICard).eq(1).contains('75000')
    })

    it('should display my events', () => {
      cy.get(Tabs).contains('Mes événements').click()

      cy.get(UICard).contains('mon evenement')
      cy.get(UICard).contains('42')
      cy.get(UICard).contains('mon prénom')
      cy.get(UICard).contains('17 janvier 2030')
      cy.get(UICard).contains('1 rue du xxxxx, 75000 Paris')
      cy.get(DotMenu).should('exist')
    })
  })
})
