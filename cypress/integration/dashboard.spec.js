const mock = (method, url, fixture) => cy.intercept(method, url, { fixture }).as(fixture)

const initialize = () => {
  cy.intercept('/api/**/*', (req) => {
    throw new Error('request not stubbed : '+req.url);
  })

  cy.intercept('POST', '/oauth/v2/token', { statusCode: 201, fixture: 'token' }).as('token')

  mock('GET', '/api/me', 'me')
  mock('GET', '/api/v3/profile/me/scopes', 'scopes')
  mock('GET', '/api/v3/profile/me/scope/referent', 'scope/referent')
  mock('GET', '/api/v3/profile/me/scope/national', 'scope/national')
  mock('GET', '/api/v3/profile/me/scope/phoning_national_manager', 'scope/phoning_national_manager')
  mock('GET', '/api/v3/profile/me/scope/pap_national_manager', 'scope/pap_national_manager')

  mock('GET', '/api/v3/internal/*/adherents?scope=*', 'internal/adherents')
  mock('GET', '/api/v3/internal/*/jemengage/downloads?scope=*', 'internal/downloads')
  mock('GET', '/api/v3/internal/*/mailCampaign/reportsRatios?scope=*', 'internal/reportsRatio')
  mock('GET', '/api/v3/internal/*/jemengage/survey?scope=*', 'internal/survey')
  mock('GET', '/api/v3/internal/*/jemengage/users?scope=*', 'internal/users')

  cy.visit('/auth?code=fake_authorization_code')
  cy.url().should('eq', 'http://localhost:3000/')
}


describe('Dashboard', () => {
  beforeEach(() => {
    initialize()
    mock('GET', '/api/v3/internal/*/adherents?scope=*', 'internal/adherents')
    mock('GET', '/api/v3/internal/*/jemengage/downloads?scope=*', 'internal/downloads')
    mock('GET', '/api/v3/internal/*/mailCampaign/reportsRatios?scope=*', 'internal/reportsRatio')
    mock('GET', '/api/v3/internal/*/jemengage/survey?scope=*', 'internal/survey')
    mock('GET', '/api/v3/internal/*/jemengage/users?scope=*', 'internal/users')
  })

  it('loads referent dashboard successfully', () => {
    cy.contains('Référent').click()

    cy.contains("Vue d'ensemble")
    cy.contains('100')
    cy.contains('12.34%')
    cy.contains('43.21% au national')
    cy.contains('42.42%')
    cy.contains('44.44% au national')
  })
})
