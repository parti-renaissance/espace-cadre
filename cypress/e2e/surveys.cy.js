import { initialize, mock } from './main.cy'

const UICard = '[data-cy="ui-card"]'
const KPICard = '[data-cy="KPICard"]'
const Tab = '.MuiTab-root'
const Typography = '.MuiTypography-root'
const PageHeaderTitle = '[data-cy="ui-page-header"]'
const PageHeaderButton = '[data-cy="ui-page-header-button"]'
const NavButton = '[data-cy="surveys-action-view"]'
const KPI = '[data-cy="KPI"]'
const LocalSurveys = '[data-cy="surveys-local"]'
const NationalSurveys = '[data-cy="surveys-national"]'
const ItemStatus = '[data-cy="surveys-item-status"]'
const ItemTitle = '[data-cy="surveys-item-title"]'
const ItemAuthor = '[data-cy="surveys-item-author"]'
const ItemQuestionsCount = '[data-cy="surveys-item-questions-count"]'
const ItemAnswersCount = '[data-cy="surveys-item-answers-count"]'
const isNotEmpty = value => expect(value.length).to.be.at.least(1)

const navigate = () => {
  cy.contains('Référent').click()
  cy.contains('Questionnaires').click()
  cy.url().should('eq', 'http://localhost:3000/questionnaires')
}

describe('Surveys', () => {
  beforeEach(() => {
    initialize()
    mock('GET', '/api/v3/surveys?*', 'surveys/surveys')
    mock('GET', '/api/v3/surveys/kpi?scope=referent', 'surveys/surveys-kpi')
    navigate()
  })

  describe('The header', () => {
    it('should have a title', () => {
      cy.get(PageHeaderTitle).should('exist')
      cy.get(PageHeaderTitle)
        .find('>div')
        .find(Typography)
        .first()
        .should('have.text', 'Questionnaires')
        .and('be.visible')
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
    it('should have 2 cards', () => {
      cy.get(KPI).find(KPICard).children().should('have.length', 2)
    })

    describe('The local Survey(s) Card', () => {
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
            const content = { score: '90', subtitle: 'Questionnaires locaux', detail: 'Dont 30 publiés' }
            if (index === 0) cy.wrap(element).should('exist').and('have.text', content.score).and('be.visible')
            if (index === 1) cy.wrap(element).should('exist').and('have.text', content.subtitle).and('be.visible')
            if (index === 2) cy.wrap(element).should('exist').contains(content.detail).and('be.visible')
          })
      })
    })

    describe('The national Survey(s) Card', () => {
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
            const content = { score: '43', subtitle: 'Questionnaires nationaux', detail: 'Dont 30 publiés' }
            if (index === 0) cy.wrap(element).should('exist').and('have.text', content.score).and('be.visible')
            if (index === 1) cy.wrap(element).should('exist').and('have.text', content.subtitle).and('be.visible')
          })
      })
    })

    // TODO: remove ".skip" when feature available
    describe.skip('The collected Answer(s) Card', () => {
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
            const content = { score: '19', subtitle: 'Réponses collectées', detail: '3 sur le mois' }
            if (index === 0) cy.wrap(element).should('exist').and('have.text', content.score).and('be.visible')
            if (index === 1) cy.wrap(element).should('exist').and('have.text', content.subtitle).and('be.visible')
            if (index === 2) cy.wrap(element).should('exist').contains(content.detail).and('be.visible')
          })
      })
    })
  })

  describe('The Tabs buttons', () => {
    it('should be 2 and have a title', () => {
      cy.get(Tab).should('exist')
      cy.get(Tab)
        .should('have.length', 2)
        .each((element, index) => {
          const labels = ['Questionnaires locaux', 'Questionnaires nationaux']
          cy.wrap(element).find(Typography).contains('span', labels[index]).and('be.visible')
        })
    })

    it('should be clickable and display their content', () => {
      cy.get(Tab).eq(1).click()
      cy.get(NationalSurveys).should('exist')
      cy.get(Tab).eq(0).click()
      cy.get(LocalSurveys).should('exist')
    })
  })

  describe('The local Survey(s) tab', () => {
    it('should be the default one', () => {
      cy.get(LocalSurveys).should('exist')
    })

    it('should display 3 cards', () => {
      cy.get(Tab).eq(0).click()
      cy.get(LocalSurveys).should('exist')
      cy.get(LocalSurveys).children().should('have.length', 3)
      cy.get(LocalSurveys).find(UICard).should('have.length', 3)
    })
  })

  describe('The national Survey(s) tab', () => {
    it('should display 2 cards', () => {
      cy.get(Tab).eq(1).click()
      cy.get(NationalSurveys).should('exist')
      cy.get(NationalSurveys).children().should('have.length', 3)
      cy.get(NationalSurveys).find(UICard).should('have.length', 3)
    })
  })

  describe('The Survey item', () => {
    it('should show a status', () => {
      cy.get(LocalSurveys)
        .find(UICard)
        .each(element => {
          cy.wrap(element).find(ItemStatus).find(Typography).should('exist').invoke('text').then(isNotEmpty)
        })
    })
    it('should show a title', () => {
      cy.get(LocalSurveys)
        .find(UICard)
        .each(element => {
          cy.wrap(element).find(ItemTitle).should('exist').invoke('text').then(isNotEmpty)
        })
    })
    it('should show an author', () => {
      cy.get(LocalSurveys)
        .find(UICard)
        .each(element => {
          cy.wrap(element).find(ItemAuthor).should('exist').invoke('text').then(isNotEmpty)
        })
    })
    it('should show a questions count', () => {
      cy.get(LocalSurveys)
        .find(UICard)
        .each(element => {
          cy.wrap(element).find(ItemQuestionsCount).find(Typography).should('exist').invoke('text').then(isNotEmpty)
        })
    })
    it('should show an answers count', () => {
      cy.get(LocalSurveys)
        .find(UICard)
        .each(element => {
          cy.wrap(element).find(ItemAnswersCount).find(Typography).should('exist').invoke('text').then(isNotEmpty)
        })
    })
    it('should show a nav button', () => {
      cy.get(LocalSurveys)
        .find(NavButton)
        .each(element => {
          cy.wrap(element).find(Typography).should('exist').and('have.text', 'voir les réponses')
        })
    })
  })
})
