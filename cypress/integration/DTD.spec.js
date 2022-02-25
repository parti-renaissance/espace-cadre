import { initialization } from './main.spec'

const Chip = '.MuiChip-root'
const KPI = '[data-cy="KPI"]'
const KPICard = '[data-cy="KPICard"]'
const UICard = '[data-cy="ui-card"]'
const Typography = '.MuiTypography-root'
const RatioProgress = '[data-cy="ui-ratio-progress"]'
const PageHeaderTitle = '[data-cy="ui-page-header"]'
const CTAButton = '[data-cy="DTD-action-view"]'
const CampaignsContainer = '[data-cy="DTD-campaigns-container"]'
const CampaignsList = '[data-cy="DTD-campaigns-list"]'
const CampaignItemEndDate = '[data-cy="DTD-campaigns-item-end-date"]'
const CampaignItemTitle = '[data-cy="DTD-campaigns-item-title"]'
const isNotEmpty = value => expect(value.length).to.be.at.least(1)

const navigate = () => {
  cy.contains('Responsable PAP').click()
  cy.contains('Porte à porte').click()
  cy.url().should('eq', 'http://localhost:3000/porte-a-porte')
}

describe('DTD', () => {
  beforeEach(() => {
    initialization()
    navigate()
  })

  describe('The header', () => {
    it('should have a title', () => {
      cy.get(PageHeaderTitle).should('exist')
      cy.get(PageHeaderTitle).find('>div').find(Typography).first().should('have.text', 'Porte à porte').and('be.visible')
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
        cy.get(KPI).find(KPICard).find('>div').eq(0).find(Typography).each((element, index) => {
          const content = { score: '4', subtitle: 'Campagnes', detail: 'Dont 1 en cours' }
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
        cy.get(KPI).find(KPICard).find('>div').eq(1).find(Typography).each((element, index) => {
          const content = { score: '253', subtitle: 'Questionnaires', detail: '27 sur un mois' }
          if (index === 0) cy.wrap(element).should('exist').and('have.text', content.score).and('be.visible')
          if (index === 1) cy.wrap(element).should('exist').and('have.text', content.subtitle).and('be.visible')
          if (index === 2) cy.wrap(element).should('exist').contains(content.detail).and('be.visible')
        })
      })
    })

    describe('The Doors Card', () => {
      it('should contain 3 parts', () => {
        cy.get(KPI).find(KPICard).find('>div').eq(2).find(Typography).should('have.length', 3)
      })
      it('should show a score, a subtitle and its detail', () => {
        cy.get(KPI).find(KPICard).find('>div').eq(2).find(Typography).each((element, index) => {
          const content = { score: '741', subtitle: 'Portes', detail: '79 sur un mois' }
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
      cy.get(CampaignsContainer).find('>div').first().find(Typography).should('have.text', 'Campagnes').and('be.visible')
    })
    it('should have a list with at least 1 card', () => {
      cy.get(CampaignsContainer).find('>div').eq(1).find(CampaignsList).should('exist').children().its('length').should('be.gte', 1)
    })

    describe('The campaign item', () => {
      it('should show a status and a date', () => {
        cy.get(CampaignsContainer).find('>div').eq(1).find(CampaignsList).each(element => {
          cy.wrap(element).find(UICard).eq(0).find(Chip).find(Typography).should('exist').invoke('text').then(isNotEmpty)
          cy.wrap(element).find(UICard).eq(0).find(CampaignItemEndDate).should('exist').invoke('text').then(isNotEmpty)
        })
      })
      it('should show a title', () => {
        cy.get(CampaignsContainer).find('>div').eq(1).find(CampaignsList).each(element => {
          cy.wrap(element).find(UICard).eq(0).find(CampaignItemTitle).should('exist').invoke('text').then(isNotEmpty)
        })
      })
      it('should show a score and a progress bar', () => {
        cy.get(CampaignsContainer).find('>div').eq(1).find(CampaignsList).each(element => {
          cy.wrap(element).find(UICard).eq(0).find(RatioProgress).find(Typography).each((element, index) => {
            cy.wrap(element).should('exist').invoke('text').then(element => {
              cy.wrap(index === 1 ? element.replace('/', '') : element).should('match', /^[0-9]*$/).then(isNotEmpty)
            })
          })
        })
      })
      it('should show a nav button', () => {
        cy.get(CampaignsContainer).find('>div').eq(1).find(CampaignsList).find(UICard).each(element => {
          cy.wrap(element).find(CTAButton).find(Typography).should('exist').and('have.text', 'voir')
        })
      })
    })
  })
})
