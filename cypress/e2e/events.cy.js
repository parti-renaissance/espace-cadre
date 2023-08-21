import { initialize, mock } from './main.cy'

const Tabs = '.MuiTabs-root'
const UICard = '[data-cy="ui-card"]'
const DotMenu = '[data-cy="dot-action-menu"]'
const KPI = '[data-cy="KPI"]'
const KPICard = '[data-cy="KPICard"]'
const Chip = '.MuiChip-root'
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
      cy.get(PageHeaderTitle).find('>div').find(Typography).first().should('have.text', 'Évènements').and('be.visible')
    })

    it('should have a clickable action button', () => {
      cy.get(PageHeaderButton).should('exist')
      cy.get(PageHeaderButton).find('>button').click()
    })
  })

  describe('Events', () => {
    it('should contain 2 lists', () => {
      cy.get(Tabs).contains('Tous les évènements')
      cy.get(Tabs).contains('Mes évènements')
    })

    it('should display my events', () => {
      cy.get(Tabs).contains('Mes évènements').click()

      cy.get(UICard).contains('mon evenement')
      cy.get(UICard).contains('42')
      cy.get(UICard).contains('mon prénom')
      cy.get(UICard).contains('17 janv. 2030')
      cy.get(UICard).contains('1 rue du xxxxx, 75000 Paris')
      cy.get(DotMenu).should('exist')
    })

    it('should display 2 events', () => {
      cy.get(Tabs).contains('Tous les évènements').click()

      cy.get(UICard).eq(0).contains('evenement 1')
      cy.get(UICard).eq(1).contains('evenement 2')

      cy.get(UICard).eq(0).contains('42')
      cy.get(UICard).eq(0).get(Chip).contains('Passé')
      cy.get(UICard).eq(0).contains('Par Prénom1 Nom1')
      cy.get(UICard).eq(0).contains('17 janv. 2022')
      cy.get(UICard).eq(0).contains('17 rue du XXXX, 95000 Jolie-Ville')
      cy.get(UICard).eq(0).contains('categorie 1')

      cy.get(UICard).eq(1).contains('1')
      cy.get(UICard).eq(1).contains('Annulé')
      cy.get(UICard).eq(1).contains('Par Prénom2 Nom2')
      cy.get(UICard).eq(1).contains('18 janv. 2022')
      cy.get(UICard).eq(1).contains('75000')
      cy.get(UICard).eq(1).contains('categorie 2')

      cy.get(DotMenu).should('not.exist')
    })

    it('should display my event', () => {
      cy.get(Tabs).contains('Mes évènements').click()
      cy.get(UICard).eq(0).contains('Gérer').click()

      cy.get(KPI).should('exist')
      cy.get(KPI).find(KPICard).children().should('have.length', 2)
      cy.get(KPI).contains('janvier 2030')
      cy.get(KPI).contains('participants')

      cy.get(UICard).eq(0).get(Chip).contains('Adhérent')
      cy.get(UICard).eq(0).contains('un adhérent')
      cy.get(UICard).eq(0).contains('75000 • Le 01 janvier 2021 à')

      cy.get(UICard).eq(0).get(Chip).contains('Contact')
      cy.get(UICard).eq(1).contains('un contact')
      cy.get(UICard).eq(1).contains('95000 • Le 02 janvier 2021 à')
    })

    it('should edit my event', () => {
      cy.get(Tabs).contains('Mes évènements').click()
      cy.get(UICard).eq(0).contains('Gérer').click()

      cy.get(PageHeaderButton).click()

      cy.get(Modale).contains("Modifier l'évènement")
      cy.get(Modale).get(InputName).invoke('attr', 'value').should('eq', 'Mon évènement')
      cy.get(Modale).get(Select).eq(0).contains('categorie 1')
    })
  })
})
