context('Nominal tests', () => {
  const apiServer = url => `https://mock.en-marche.fr${url}`

  const mock = (method, url, fixture) => cy.intercept(method, apiServer(url), { fixture }).as(fixture)

  beforeEach(() => {
    mock('POST', '/oauth/v2/token', 'token')
    cy.intercept('GET', '/api/me', { fixture: 'me' }).as('me')
    mock('GET', '/api/v3/profile/me/scopes', 'scopes')
    mock('GET', '/api/v3/profile/me/scope/referent', 'scope/referent')
    mock('GET', '/api/v3/internal/*/adherents?scope=referent', 'internal/adherents')
    mock('GET', '/api/v3/internal/*/jemengage/downloads?scope=referent', 'internal/downloads')
    mock('GET', '/api/v3/internal/*/mailCampaign/reportsRatios?scope=referent', 'internal/reportsRatio')
    mock('GET', '/api/v3/internal/*/jemengage/survey?scope=referent', 'internal/survey')
    mock('GET', '/api/v3/internal/*/jemengage/users?scope=referent', 'internal/users')
    mock('GET', '/api/v3/adherents/columns?scope=referent', 'adherents/columns')
    mock('GET', '/api/v3/adherents?page=1&scope=referent', 'adherents/adherents')
    mock('GET', '/api/v3/adherents/filters?feature=contacts&scope=referent', 'adherents/filters')

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
