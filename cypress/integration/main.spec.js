context('Nominal tests', () => {
  const apiServer = url => `https://mock.en-marche.fr${url}`

  const mock = (method, url, fixture) => cy.intercept(method, apiServer(url), { fixture }).as(fixture)

  beforeEach(() => {
    mock('POST', '/oauth/v2/token', 'token')
    mock('GET', '/api/me', 'me')
    mock('GET', '/api/v3/profile/me/scopes', 'scopes')
    mock('GET', '/api/v3/profile/me/scope/referent', 'scope/referent')
    mock('GET', '/api/v3/internal/*/adherents?scope=referent', 'internal/adherents')
    mock('GET', '/api/v3/internal/*/jemengage/downloads?scope=referent', 'internal/downloads')
    mock('GET', '/api/v3/internal/*/mailCampaign/reportsRatios?scope=referent', 'internal/reportsRatio')
    mock('GET', '/api/v3/internal/*/mailCampaign/reports?scope=referent', 'internal/reports')
    mock('GET', '/api/v3/internal/*/jemengage/survey?scope=referent', 'internal/survey')
    mock('GET', '/api/v3/internal/*/jemengage/users?scope=referent', 'internal/users')
    mock('GET', '/api/v3/adherents/columns?scope=referent', 'adherents/columns')
    mock('GET', '/api/v3/adherents?page=1&scope=referent', 'adherents/adherents')
    mock('GET', '/api/v3/adherents/filters?feature=contacts&scope=referent', 'adherents/filters')
    mock('GET', '/api/v3/teams?scope=referent', 'teams/teams')
    mock('GET', '/api/v3/teams/11111111-1111-1111-1111-111111111111?scope=referent', 'teams/1')

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

  xit('loads referent messagerie successfully', () => {
    cy.contains('Référent').click()
    cy.contains('Messagerie').click()

    cy.contains("Campagnes d'emails")
    cy.contains('Title1')
    cy.contains('Title2')
    cy.contains('33.33%(33)')
    cy.contains('Envoyer un email')
  })

  it('loads referent teams successfully', () => {
    cy.contains('Référent').click()
    cy.contains('Équipes').click()

    cy.contains('Team1')
    cy.contains('1 membre')
    cy.contains('42 membres')
    cy.contains('Team2')

    cy.contains('Voir').first().click()
    cy.url().should('eq', 'http://localhost:3000/equipes/11111111-1111-1111-1111-111111111111/editer')
    cy.contains('firstname1 lastname1')
    cy.contains('92100, adhérent(e) depuis le 01/06/2019')
  })
})
