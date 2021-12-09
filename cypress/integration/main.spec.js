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
    mock('GET', '/api/v3/internal/*/jemengage/survey?scope=referent', 'internal/survey')
    mock('GET', '/api/v3/internal/*/jemengage/users?scope=referent', 'internal/users')
    mock('GET', '/api/v3/adherent_messages?scope=referent', 'messagerie/messages')
    mock('GET', '/api/v3/adherents/columns?scope=referent', 'adherents/columns')
    mock('GET', '/api/v3/adherents?page=1&scope=referent', 'adherents/adherents')
    mock('GET', '/api/v3/adherents/filters?feature=contacts&scope=referent', 'adherents/filters')
    mock('GET', '/api/v3/teams?scope=referent', 'teams/teams')
    mock('GET', '/api/v3/teams/11111111-1111-1111-1111-111111111111?scope=referent', 'teams/1')
    mock('GET', '/api/v3/jecoute/news?scope=referent', 'news/news')

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

    cy.contains("Vue d'ensemble")
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

  it('loads referent messagerie successfully', () => {
    cy.contains('Référent').click()
    cy.contains('Messagerie').click()

    cy.contains("Campagnes d'emails")

    cy.contains('subject 1')
    cy.contains('Brouillon')
    cy.get('.MuiChip-label').eq(0).should('contain', 'Envoyé')
    cy.contains('Le 01/11/2021')

    cy.contains('subject 2')
    cy.get('.MuiChip-label').eq(5).should('contain', 'Brouillon')
    cy.contains('Le 02/11/2021')

    cy.contains('Envoyer un email')
  })

  it('loads referent teams successfully', () => {
    cy.contains('Référent').click()
    cy.contains('Équipes').click()

    cy.contains('Team1')
    cy.contains('1 membre')
    cy.contains('Team2')
    cy.contains('42 membres')

    cy.contains('Voir').first().click()
    cy.url().should('eq', 'http://localhost:3000/equipes/11111111-1111-1111-1111-111111111111/editer')
    cy.contains('firstname1 lastname1')
    cy.contains('92100, adhérent(e) depuis le ' + new Date(2019, 5, 1, 12, 0).toLocaleDateString())
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
    cy.get('[data-testid="CloseIcon"]').click()
    cy.get(newsReadOnlyModalSelector).should('not.exist')

    cy.get('.MuiPaper-root').eq(1).contains('Voir').click()
    cy.get('button').contains('Modifier').click()
    cy.get('input[name="title"]').should('have.value', 'Titre 2')
    cy.get('textarea[name="body"]').should('have.value', 'Texte 2')
    cy.get('input[name="url"]').should('have.value', '')
    cy.get('[type="checkbox"]').eq(0).should('not.be.checked')
    cy.get('[type="checkbox"]').eq(1).should('be.checked')
  })
})
