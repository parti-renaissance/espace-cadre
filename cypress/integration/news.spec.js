import { initialization } from './main.spec'

describe('News', () => {
  beforeEach(() => {
    initialization()
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
    cy.get('textarea[name="body"]').should('have.value', 'Texte 2')
    cy.get('input[name="url"]').should('have.value', '')
    cy.get('[type="checkbox"]').eq(0).should('not.be.checked')
    cy.get('[type="checkbox"]').eq(1).should('be.checked')
  })
})
