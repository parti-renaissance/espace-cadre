const apiServer = url => `${Cypress.env('REACT_APP_API_HOST')}${url}`
const oAuthServer = url => `${Cypress.env('REACT_APP_OAUTH_HOST')}${url}`
export const mock = (method, url, fixture) => cy.intercept(method, apiServer(url), { fixture }).as(fixture)
export const initialization = () => {
  cy.intercept('POST', /sentry/g, {
    statusCode: 201,
  }).as('sentry')

  cy.intercept('POST', oAuthServer('/oauth/v2/token'), { statusCode: 201, fixture: 'token' }).as('token')

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
