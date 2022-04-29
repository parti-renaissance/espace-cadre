import { initialization } from './main.spec'
import { mock } from './main.spec'

const navigate = () => {
  cy.contains('Référent').click()
  cy.contains('Actualités').click()
  cy.url().should('eq', 'http://localhost:3000/actualites')
}

describe('News', () => {
  beforeEach(() => {
    initialization()
    mock('GET', '/api/v3/jecoute/news?order[created_at]=desc&page=1&page_size=20&scope=referent', 'news/news')
    navigate()
  })

  it('loads referent news successfully', () => {
    const newsReadOnlyModalSelector = 'div[data-testid="news-read-only-modal"]'

    cy.contains('Référent').click()
    cy.contains('Actualités').click()

    cy.contains('Titre 1')
    cy.contains('M Creator 1')
    cy.contains('15/10/2020')
    cy.get('div[data-testid="news-header"]').eq(0).should('contain', 'Publiée')
    cy.contains('Titre 2')
    cy.contains('M Creator 2')
    cy.contains('10/10/2020')
    cy.get('div[data-testid="news-header"]').eq(1).should('contain', 'Publiée')

    cy.contains('Voir').eq(0).click()

    cy.contains(newsReadOnlyModalSelector, 'Publiée')
    cy.contains(newsReadOnlyModalSelector, 'Titre 1')
    cy.contains(newsReadOnlyModalSelector, 'M Creator 1')
    cy.contains(newsReadOnlyModalSelector, '15/10/2020')
    cy.contains(newsReadOnlyModalSelector, 'Publiée')
    cy.get('[data-testid="close-icon"]').click()
    cy.get(newsReadOnlyModalSelector).should('not.exist')

    cy.get('.MuiPaper-root').eq(3).contains('Voir').click()
    cy.get('button').contains('Modifier').click()
    cy.get('input[name="title"]').should('have.value', 'Titre 2')
    cy.get('.ck .ck-editor__main').eq(0).should('contain', 'Texte 2')
    cy.get('input[name="url"]').should('have.value', '')
    cy.get('[type="checkbox"]').eq(0).should('not.be.checked')
  })
})
