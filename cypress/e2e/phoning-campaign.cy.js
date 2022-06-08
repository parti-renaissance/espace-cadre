import { initialize, mock } from './main.cy'

const UICard = '[data-cy="ui-card"]'
const Typography = '.MuiTypography-root'
const Tab = '.MuiTab-root'
const HeaderCell = 'thead>tr>th'
const PageHeaderTitle = '[data-cy="ui-page-header"]'
const PageHeaderButton = '[data-cy="ui-page-header-button"]'
const CTAButton = '[data-cy="phoning-action-view"]'
const KPI = '[data-cy="KPI"]'
const KPICard = '[data-cy="KPICard"]'
const Callers = '[data-cy="phoning-campaign-detail-callers"]'
const History = '[data-cy="phoning-campaign-detail-history"]'
const Surveys = '[data-cy="phoning-campaign-detail-surveys"]'
const CreateEdit = '[data-cy="phoning-create-edit"]'

const navigate = () => {
  cy.contains('Responsable Phoning').click()
  cy.contains('a', 'Phoning').click()
  cy.url().should('eq', 'http://localhost:3000/phoning')
  cy.get(CTAButton).first().click()
  cy.url().should('eq', 'http://localhost:3000/phoning/11111111-1111-1111-1111-111111111111')
}

describe('PHONING > Campaign Detail', () => {
  beforeEach(() => {
    initialize()
    mock('GET', '/api/v3/phoning_campaigns/kpi?scope=phoning_national_manager', 'phoning/kpi')
    mock('GET', '/api/v3/teams?*', 'groups/groups')
    mock(
      'GET',
      '/api/v3/phoning_campaigns?order[created_at]=desc&page=1&page_size=20&visibility=national&scope=phoning_national_manager',
      'phoning/campaigns'
    )
    mock(
      'GET',
      '/api/v3/phoning_campaigns/11111111-1111-1111-1111-111111111111?scope=phoning_national_manager',
      'phoning/campaignDetail/campaignDetail'
    )
    mock(
      'GET',
      '/api/v3/phoning_campaigns/11111111-1111-1111-1111-111111111111/callers?scope=phoning_national_manager',
      'phoning/campaignDetail/callers'
    )
    mock(
      'GET',
      '/api/v3/phoning_campaigns/11111111-1111-1111-1111-111111111111/replies?scope=phoning_national_manager',
      'phoning/campaignDetail/replies'
    )
    mock(
      'GET',
      '/api/v3/phoning_campaign_histories?campaign.uuid=11111111-1111-1111-1111-111111111111&order[created_at]=desc&page=1&page_size=20&scope=phoning_national_manager',
      'phoning/campaignDetail/histories'
    )
    mock('GET', '/api/v3/surveys?*', 'surveys/surveys')
    navigate()
  })

  describe('The header', () => {
    it('should have a breadcrumb', () => {
      cy.get(PageHeaderTitle).should('exist')
      cy.get(PageHeaderTitle).find('>div').find(Typography).first().should('have.text', 'Phoning').and('be.visible')
      cy.get(PageHeaderTitle)
        .find('>div')
        .find(Typography)
        .eq(2)
        .invoke('text')
        .then(value => expect(value.length).to.be.at.least(0))
    })

    it('should have a clickable action button', () => {
      cy.get(PageHeaderButton).should('exist')
      cy.get(PageHeaderButton).first().click()
      cy.get(CreateEdit).should('exist')
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
      cy.get(KPI).find(KPICard).should('have.length', 4)
    })
  })

  describe('The Tabs buttons', () => {
    it('should be 3 and have a title', () => {
      cy.get('.MuiTab-root').should('exist')
      cy.get(Tab)
        .should('have.length', 3)
        .each((element, index) => {
          const labels = ['appelants', 'appels', 'questionnaires']
          cy.wrap(element).find(Typography).contains('span', labels[index]).and('be.visible')
        })
    })

    it('should be clickable and display their content', () => {
      cy.get(Tab).eq(2).click()
      cy.get(Surveys).should('exist')
      cy.get(Tab).eq(1).click()
      cy.get(History).should('exist')
      cy.get(Tab).eq(0).click()
      cy.get(Callers).should('exist')
    })
  })

  describe('The Callers tab', () => {
    it('should be the default one', () => {
      cy.get(Callers).should('exist')
    })

    it('should display 5 cards', () => {
      cy.get(Tab).eq(0).click()
      cy.get(Callers).should('exist')
      cy.get(Callers).children().should('have.length', 5)
      cy.get(Callers).find(UICard).should('have.length', 5)
    })
  })

  describe('The History tab', () => {
    it('should display 4 cards', () => {
      cy.get(Tab).eq(1).click()
      cy.get(History).should('exist')
      cy.get(History).children().should('have.length', 4)
      cy.get(History).find(UICard).should('have.length', 4)
    })
  })

  describe('The Surveys tab', () => {
    beforeEach(() => {
      cy.get(Tab).eq(2).click()
      cy.get(Surveys).should('exist')
    })

    it('should display a header row', () => {
      cy.get('thead').should('exist')
      cy.get(HeaderCell).eq(0).find(Typography).should('have.text', 'Appelé').and('be.visible')
      cy.get(HeaderCell).eq(1).find(Typography).should('have.text', 'Date (Temps)').and('be.visible')
      cy.get('tbody').should('exist').children().should('have.length', 2)
    })

    it('should have 2 permanent columns', () => {
      cy.get(HeaderCell).eq(0).find(Typography).should('have.text', 'Appelé').and('be.visible')
      cy.get(HeaderCell).eq(1).find(Typography).should('have.text', 'Date (Temps)').and('be.visible')
    })

    it('should have at least 1 answer column', () => {
      cy.get(HeaderCell).eq(2).find(Typography).should('exist')
    })

    it('should have 2 surveys', () => {
      cy.get('tbody').should('exist').children().should('have.length', 2)
    })
  })
})
