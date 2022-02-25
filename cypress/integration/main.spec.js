const apiServer = url => `${Cypress.env('REACT_APP_API_HOST')}${url}`
const oAuthServer = url => `${Cypress.env('REACT_APP_OAUTH_HOST')}${url}`
const mock = (method, url, fixture) => cy.intercept(method, apiServer(url), { fixture }).as(fixture)
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
  mock(
    'GET',
    '/api/v3/adherent_messages?order[created_at]=desc&page=1&page_size=20&scope=referent',
    'messagerie/messages'
  )
  mock('GET', '/api/v3/adherents/columns?scope=referent', 'activists/columns')
  mock('GET', '/api/v3/adherents?page=1&scope=referent', 'activists/activists')
  mock('GET', '/api/v3/adherents/filters?feature=contacts&scope=referent', 'activists/filters')
  mock('GET', '/api/v3/teams?order*=desc&page=1&page_size=20&scope=*', 'groups/groups')
  mock('GET', '/api/v3/teams/11111111-1111-1111-1111-111111111111?scope=referent', 'groups/1')
  mock('GET', '/api/v3/jecoute/news?order[created_at]=desc&page=1&page_size=20&scope=referent', 'news/news')
  mock('GET', '/api/v3/ripostes?order[created_at]=desc&page=1&page_size=20&scope=national', 'ripostes/ripostes')

  mock('GET', '/api/v3/phoning_campaigns/kpi?scope=phoning_national_manager', 'phoning/kpi')
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
  mock(
    'GET',
    '/api/v3/events?order*=desc&page=1&page_size=20&scope=*',
    'events/events'
  )
  mock(
    'GET',
    '/api/v3/events?order*=desc&page=1&page_size=20&only_mine&scope=*',
    'events/myevents'
  )
  mock(
    'GET',
    '/api/v3/events/11111111-1111-1111-1111-111111111111?scope=*',
    'events/event'
  )
  mock(
    'GET',
    '/api/v3/events/11111111-1111-1111-1111-111111111111/participants?scope=*',
    'events/attendees'
  )
  mock(
    'GET',
    '/api/event_categories',
    'events/categories'
  )
  mock('GET', '/api/v3/pap_campaigns/kpi?scope=pap_national_manager', 'DTD/KPI')
  mock('GET', '/api/v3/pap_campaigns?order[created_at]=desc&page=1&page_size=20&scope=pap_national_manager', 'DTD/campaigns')
  mock('GET', '/api/v3/my_teams?scope=referent', 'my-team/my-team')
  mock('GET', '/api/v3/adherents/autocomplete?q=e&scope=referent', 'my-team/activist')
  mock(
    'GET',
    '/api/v3/surveys?order[created_at]=desc&page=1&page_size=20&scope=referent',
    'surveys/surveys'
  )

  cy.visit('/auth?code=fake_authorization_code')
  cy.url().should('eq', 'http://localhost:3000/')
}
