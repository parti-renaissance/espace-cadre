context('Nominal tests', () => {
  beforeEach(() => {
    cy.intercept('POST', 'https://staging.en-marche.fr/oauth/v2/token', { fixture: 'token' }).as('oauthToken')
    cy.intercept('GET', '/api/me', { fixture: 'me' }).as('me')
    cy.intercept('GET', 'https://staging.en-marche.fr/api/v3/profile/me/scopes', { fixture: 'scopes' }).as('scopes')

    cy.intercept('GET', 'https://staging.en-marche.fr/api/v3/profile/me/scope/referent', {
      fixture: 'scope/referent',
    }).as('scope/referent')
    cy.intercept('GET', 'https://staging.en-marche.fr/api/v3/internal/*/adherents?scope=referent', {
      fixture: 'internal/adherents',
    }).as('internal/adherents')
    cy.intercept('GET', 'https://staging.en-marche.fr/api/v3/internal/*/jemengage/downloads?scope=referent', {
      fixture: 'internal/downloads',
    }).as('internal/downloads')
    cy.intercept('GET', 'https://staging.en-marche.fr/api/v3/internal/*/mailCampaign/reportsRatios?scope=referent', {
      fixture: 'internal/reportsRatio',
    }).as('internal/reportsRatio')
    cy.intercept('GET', 'https://staging.en-marche.fr/api/v3/internal/*/jemengage/survey?scope=referent', {
      fixture: 'internal/survey',
    }).as('internal/survey')
    cy.intercept('GET', 'https://staging.en-marche.fr/api/v3/internal/*/jemengage/users?scope=referent', {
      fixture: 'internal/users',
    }).as('internal/users')
    cy.intercept('GET', 'https://staging.en-marche.fr/api/v3/adherents/columns?scope=referent', {
      fixture: 'adherents/columns',
    }).as('adherents/columns')
    cy.intercept('GET', 'https://staging.en-marche.fr/api/v3/adherents?page=1&scope=referent', {
      fixture: 'adherents/adherents',
    }).as('adherents/adherents')
    cy.intercept('GET', 'https://staging.en-marche.fr/api/v3/adherents/filters?feature=contacts&scope=referent', {
      fixture: 'adherents/filters',
    }).as('adherents/filters')

    cy.visit('/auth?code=fake_authorization_code')
    cy.url().should('eq', 'http://localhost:3000/')
  })

  it('loads homepage successfully', () => {
    cy.contains('Député')
    cy.contains('National')
    cy.contains('Responsable Phoning')
    cy.contains('Référent')
  })

  it('loads referent dashboard successfully', () => {
    cy.contains('Référent').click()

    cy.contains('Vue d’ensemble')
    cy.contains('100')
    cy.contains('12.34%')
    cy.contains('43.21% au national')
    cy.contains('42.42%')
    cy.contains('44.44% au national')
  })

  it('loads "adherents" page successfully', () => {
    cy.contains('Référent').click()
    cy.contains('Adhérents').click()
  })
})
