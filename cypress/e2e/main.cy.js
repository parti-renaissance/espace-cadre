export const mock = (method, url, fixture) => cy.intercept(method, url, { fixture }).as(fixture)

export const initialize = () => {
  cy.intercept('/api/**/*', req => {
    throw new Error('request not stubbed : ' + req.url)
  })

  cy.on('uncaught:exception', err => !err.message.includes('ResizeObserver loop limit exceeded'))

  cy.intercept('POST', '/oauth/v2/token', { statusCode: 201, fixture: 'token' }).as('token')

  mock('GET', '/api/me', 'me')
  mock('GET', '/api/v3/profile/me/scopes', 'scopes')
  mock('GET', '/api/v3/profile/me/scope/referent', 'scope/referent')
  mock('GET', '/api/v3/profile/me/scope/national', 'scope/national')
  mock('GET', '/api/v3/profile/me/scope/phoning_national_manager', 'scope/phoning_national_manager')
  mock('GET', '/api/v3/profile/me/scope/pap_national_manager', 'scope/pap_national_manager')
  mock('GET', '/api/v3/profile/me/scope/president_departmental_assembly', 'scope/president_departmental_assembly')
  mock('POST', '/api/v3/adherents/count?since=&scope=*', 'internal/adherents')
  mock('GET', '/api/v3/adherent_messages/kpi?scope=*', 'internal/reportsRatio')
  mock('GET', '/api/v3/hub-items?scope=*', 'internal/hubItems')

  cy.visit('/auth?code=fake_authorization_code')
  cy.url().should('eq', 'http://localhost:3000/')
}
