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

describe('Activists', () => {
  beforeEach(() => {
    initialize()
    mock(
      'GET',
      '/api/v3/adherent_messages?order[created_at]=desc&page=1&page_size=20&scope=referent',
      'messagerie/messages'
    )
    mock('GET', '/api/v3/adherents/columns?scope=referent', 'activists/columns')
    mock('GET', '/api/v3/adherents?page=1&scope=referent', 'activists/activists')
    mock('GET', '/api/v3/adherents/filters?feature=contacts&scope=referent', 'activists/filters')
  })

  it('loads "activists" page successfully', () => {
    cy.contains('Référent').click()
    cy.contains('Militants').click()
  })
})
