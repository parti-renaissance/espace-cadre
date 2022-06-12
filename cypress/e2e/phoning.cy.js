import { initialize, mock } from './main.cy'

const Chip = '.MuiChip-root'
const Typography = '.MuiTypography-root'
const PageHeaderTitle = '[data-cy="ui-page-header"]'
const PageHeaderButton = '[data-cy="ui-page-header-button"]'
const CTAButton = '[data-cy="phoning-action-view"]'
const KPI = '[data-cy="KPI"]'
const CampaignsContainer = '[data-cy="phoning-campaigns-container"]'
const CampaignsList = '[data-cy="phoning-campaigns-list"]'
const CampaignItemTitle = '[data-cy="phoning-campaigns-item-title"]'
const UICard = '[data-cy="ui-card"]'
const KPICard = '[data-cy="KPICard"]'
const isNotEmpty = value => expect(value.length).to.be.at.least(1)

const navigate = () => {
  cy.contains('Responsable Phoning').click()
  cy.contains('a', 'Phoning').click()
  cy.url().should('eq', 'http://localhost:3000/phoning')
}

describe('Phoning', () => {
  beforeEach(() => {
    initialize()
    mock('GET', '/api/v3/teams?*', 'groups/groups')
    mock('GET', '/api/v3/phoning_campaigns/kpi?scope=phoning_national_manager', 'phoning/kpi')
    mock(
      'GET',
      '/api/v3/phoning_campaigns?order[created_at]=desc&page=1&page_size=20&visibility=national&scope=phoning_national_manager',
      'phoning/campaigns'
    )
    mock('GET', '/api/v3/surveys?*', 'surveys/surveys')
    navigate()
  })

  describe('The header', () => {
    it('should have a title', () => {
      cy.get(PageHeaderTitle).should('exist')
      cy.get(PageHeaderTitle).find('>div').find(Typography).first().should('have.text', 'Phoning').and('be.visible')
    })
    it('should have a clickable action button', () => {
      cy.get(PageHeaderButton).should('exist')
      cy.get(PageHeaderButton).find('>button').click()
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
    it('should have 3 cards', () => {
      cy.get(KPI).find(KPICard).children().should('have.length', 3)
    })

    describe('The Campaigns Card', () => {
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
            const content = { score: '13', subtitle: 'Campagnes', detail: 'Dont 2 en cours' }
            if (index === 0) cy.wrap(element).should('exist').and('have.text', content.score).and('be.visible')
            if (index === 1) cy.wrap(element).should('exist').and('have.text', content.subtitle).and('be.visible')
            if (index === 2) cy.wrap(element).should('exist').contains(content.detail).and('be.visible')
          })
      })
    })

    describe('The Survey Card', () => {
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
            const content = { score: '70', subtitle: 'Questionnaires', detail: '12 sur un mois' }
            if (index === 0) cy.wrap(element).should('exist').and('have.text', content.score).and('be.visible')
            if (index === 1) cy.wrap(element).should('exist').and('have.text', content.subtitle).and('be.visible')
            if (index === 2) cy.wrap(element).should('exist').contains(content.detail).and('be.visible')
          })
      })
    })

    describe('The Calls Card', () => {
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
            const content = { score: '452', subtitle: 'Appels', detail: '75 sur un mois' }
            if (index === 0) cy.wrap(element).should('exist').and('have.text', content.score).and('be.visible')
            if (index === 1) cy.wrap(element).should('exist').and('have.text', content.subtitle).and('be.visible')
            if (index === 2) cy.wrap(element).should('exist').contains(content.detail).and('be.visible')
          })
      })
    })
  })

  describe('The Campaigns block', () => {
    it('should contain 2 parts', () => {
      cy.get(CampaignsContainer).should('exist')
      cy.get(CampaignsContainer).find('>div').should('have.length', 2)
    })
    it('should have a title', () => {
      cy.get(CampaignsContainer)
        .find('>div')
        .first()
        .find(Typography)
        .should('have.text', 'Campagnes')
        .and('be.visible')
    })
    it('should have a list with at least 1 card', () => {
      cy.get(CampaignsContainer)
        .find('>div')
        .eq(1)
        .find(CampaignsList)
        .should('exist')
        .children()
        .its('length')
        .should('be.gte', 1)
    })

    describe('The campaign item', () => {
      it('should show a status', () => {
        cy.get(CampaignsContainer)
          .find('>div')
          .eq(1)
          .find(CampaignsList)
          .each(element => {
            cy.wrap(element)
              .find(UICard)
              .eq(0)
              .find(Chip)
              .find(Typography)
              .should('exist')
              .invoke('text')
              .then(isNotEmpty)
          })
      })
      it('should show a title', () => {
        cy.get(CampaignsContainer)
          .find('>div')
          .eq(1)
          .find(CampaignsList)
          .each(element => {
            cy.wrap(element).find(UICard).eq(0).find(CampaignItemTitle).should('exist').invoke('text').then(isNotEmpty)
          })
      })
      it('should show a nav button', () => {
        cy.get(CampaignsContainer)
          .find('>div')
          .eq(1)
          .find(CampaignsList)
          .find(UICard)
          .each(element => {
            cy.wrap(element).find(CTAButton).find(Typography).should('exist').and('have.text', 'voir')
          })
      })
    })
  })
})
