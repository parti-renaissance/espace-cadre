const apiServer = url => `https://mock.en-marche.fr${url}`
const mock = (method, url, fixture) => cy.intercept(method, apiServer(url), { fixture }).as(fixture)
export const initialization = () => {
  cy.intercept('POST', /sentry/g, {
    statusCode: 201,
  }).as('sentry')

  mock('POST', '/oauth/v2/token', 'token')
  mock('GET', '/api/me', 'me')
  mock('GET', '/api/v3/profile/me/scopes', 'scopes')
  mock('GET', '/api/v3/profile/me/scope/referent', 'scope/referent')
  mock('GET', '/api/v3/profile/me/scope/national', 'scope/national')
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
  mock('GET', '/api/v3/adherents/columns?scope=referent', 'adherents/columns')
  mock('GET', '/api/v3/adherents?page=1&scope=referent', 'adherents/adherents')
  mock('GET', '/api/v3/adherents/filters?feature=contacts&scope=referent', 'adherents/filters')
  mock('GET', '/api/v3/teams?order*=desc&page=1&page_size=20&scope=*', 'groups/groups')
  mock('GET', '/api/v3/teams/11111111-1111-1111-1111-111111111111?scope=referent', 'groups/1')
  mock('GET', '/api/v3/jecoute/news?order[created_at]=desc&page=1&page_size=20&scope=referent', 'news/news')
  mock('GET', '/api/v3/ripostes?order[created_at]=desc&page=1&page_size=20&scope=national', 'ripostes/ripostes')
  mock('GET', '/api/v3/profile/me/scope/phoning_national_manager', 'phoning/phoningScope')
  mock('GET', '/api/v3/phoning_campaigns/kpi?scope=phoning_national_manager', 'phoning/kpi')
  mock(
    'GET',
    '/api/v3/phoning_campaigns?order[created_at]=desc&page=1&page_size=20&scope=phoning_national_manager',
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

  cy.visit('/auth?code=fake_authorization_code')
  cy.url().should('eq', 'http://localhost:3000/')
}
