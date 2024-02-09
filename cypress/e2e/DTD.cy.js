import { initialize, mock } from './main.cy'

const Chip = '.MuiChip-root'
const KPI = '[data-cy="KPI"]'
const KPICard = '[data-cy="KPICard"]'
const UICard = '[data-cy="ui-card"]'
const Typography = '.MuiTypography-root'
const RatioProgress = '[data-cy="ui-ratio-progress"]'
const PageHeaderTitle = '[data-cy="ui-page-header"]'
const CTAButton = '[data-cy="DTD-action-view"]'
const CampaignsTabs = '[data-cy="DTD-campaigns-tabs"]'
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
    initialize()
    mock('GET', '/api/v3/pap_campaigns/kpi?scope=pap_national_manager', 'DTD/KPI')
    mock(
      'GET',
      '/api/v3/pap_campaigns?order[created_at]=desc&page=1&page_size=20&scope=pap_national_manager',
      'DTD/campaigns'
    )
    navigate()
  })

  describe('The header', () => {
    it('should have a title', () => {
      cy.get(PageHeaderTitle).should('exist')
      cy.get(PageHeaderTitle)
        .find('>div')
        .find(Typography)
        .first()
        .should('have.text', 'Porte à porte')
        .and('be.visible')
    })
  })

  describe('The KPI block', () => {
    it('should contain 1 parts', () => {
      cy.get(KPI).should('exist')
    })

    it('should have 3 cards', () => {
      cy.get(KPI).find(KPICard).children().should('have.length', 3)
    })

    describe('The Campaigns Card', () => {
      it('should contain 3 parts', () => {
        cy.get(KPI).find(KPICard).find('>div').eq(0).find(Typography).should('have.length', 3)
      })
      it('should show a score, a subtitle and its detail', () => {
        const content = { score: '2', subtitle: 'Campagnes', detail: 'Dont 1 en cours' }
        Object.keys(content).forEach(key => {
          cy.get(KPI).find(KPICard).find('>div').eq(0).findByText(content[key]).should('exist').and('be.visible')
        })
      })
    })

    describe('The Survey Card', () => {
      it('should contain 3 parts', () => {
        cy.get(KPI).find(KPICard).find('>div').eq(1).find(Typography).should('have.length', 3)
      })
      it('should show a score, a subtitle and its detail', () => {
        const content = { score: '10', subtitle: 'Questionnaires', detail: '5 sur un mois' }
        Object.keys(content).forEach(key => {
          cy.get(KPI).find(KPICard).find('>div').eq(1).findByText(content[key]).should('exist').and('be.visible')
        })
      })
    })

    describe('The Doors Card', () => {
      it('should contain 3 parts', () => {
        cy.get(KPI).find(KPICard).find('>div').eq(2).find(Typography).should('have.length', 3)
      })
      it('should show a score, a subtitle and its detail', () => {
        const content = { score: '200', subtitle: 'Portes', detail: '50 sur un mois' }
        Object.keys(content).forEach(key => {
          cy.get(KPI).find(KPICard).find('>div').eq(2).findByText(content[key]).should('exist').and('be.visible')
        })
      })
    })
  })

  describe('The tabs block', () => {
    it('should have 4 tabs', () => {
      cy.get(CampaignsTabs).should('exist')
      cy.get(CampaignsTabs).find('button').should('have.length', 4)
    })

    describe('The first tab', () => {
      it('should have a title and be clickable', () => {
        cy.get(CampaignsTabs).find('button').eq(0).should('have.text', 'Campagnes de mon territoire')
      })

      it('should contain 2 parts', () => {
        cy.get(CampaignsTabs).find('button').eq(0).click()
        cy.get(CampaignsList).should('exist')
        cy.get(CampaignsList).find('>div').should('have.length', 2)
      })
      it('should have a title', () => {
        cy.get(CampaignsList).find('>div').first().contains('[National] Campagne 1')
      })
      it('should have a list with at least 1 card', () => {
        cy.get(CampaignsList).find(UICard).its('length').should('be.gte', 1)
      })

      describe('The campaign item', () => {
        it('should show a status and a date', () => {
          cy.get(CampaignsList)
            .find('>div')
            .each(element => {
              cy.wrap(element)
                .find(UICard)
                .eq(0)
                .find(Chip)
                .find(Typography)
                .should('exist')
                .invoke('text')
                .then(isNotEmpty)
              cy.wrap(element)
                .find(UICard)
                .eq(0)
                .find(CampaignItemEndDate)
                .should('exist')
                .invoke('text')
                .then(isNotEmpty)
            })
        })
        it('should show a title', () => {
          cy.get(CampaignsList)
            .find('>div')
            .each(element => {
              cy.wrap(element)
                .find(UICard)
                .eq(0)
                .find(CampaignItemTitle)
                .should('exist')
                .invoke('text')
                .then(isNotEmpty)
            })
        })
        it('should show a score and a progress bar', () => {
          cy.get(CampaignsList)
            .find('>div')
            .each(element => {
              cy.wrap(element)
                .find(UICard)
                .eq(0)
                .find(RatioProgress)
                .find(Typography)
                .each((element, index) => {
                  cy.wrap(element)
                    .should('exist')
                    .invoke('text')
                    .then(element => {
                      cy.wrap(index === 1 ? element.replace('/', '') : element)
                        .should('match', /^[0-9]*$/)
                        .then(isNotEmpty)
                    })
                })
            })
        })
        it('should show a nav button', () => {
          cy.get(CampaignsList)
            .find('>div')
            .eq(1)
            .find(UICard)
            .each(element => {
              cy.wrap(element).find(CTAButton).find(Typography).should('exist').and('have.text', 'voir')
            })
        })
      })
    })
  })
})
