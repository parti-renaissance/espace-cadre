import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

context('Nominal tests', () => {
  const apiServer = url => `https://mock.en-marche.fr${url}`

  const mock = (method, url, fixture) => cy.intercept(method, apiServer(url), { fixture }).as(fixture)

  beforeEach(() => {
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
    mock('GET', '/api/v3/teams?scope=*', 'teams/teams')
    mock('GET', '/api/v3/teams/11111111-1111-1111-1111-111111111111?scope=referent', 'teams/1')
    mock('GET', '/api/v3/jecoute/news?order[created_at]=desc&page=1&page_size=20&scope=referent', 'news/news')
    mock('GET', '/api/v3/ripostes?order[created_at]=desc&page=1&page_size=20&scope=national', 'ripostes/ripostes')
    mock('GET', '/api/v3/profile/me/scope/phoning_national_manager', 'phoning/phoningScope')
    mock('GET', '/api/v3/phoning_campaigns/kpi?scope=phoning_national_manager', 'phoning/kpi')
    mock('GET', '/api/v3/phoning_campaigns?scope=phoning_national_manager', 'phoning/campaigns')
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
      '/api/v3/phoning_campaign_histories?campaign.uuid=11111111-1111-1111-1111-111111111111&scope=phoning_national_manager',
      'phoning/campaignDetail/histories'
    )

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

    cy.contains('Indicateurs')

    cy.contains('subject 1')
    cy.contains('Brouillon')
    cy.get('.MuiPaper-root').eq(0).get('.MuiChip-label').eq(0).should('contain', 'Envoyé')
    cy.contains('Le 01/11/2021')

    cy.contains('subject 2')
    cy.get('.MuiPaper-root').eq(1).get('.MuiChip-label').should('contain', 'Brouillon')
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

  it('loads phoning page successfully', () => {
    const paperRoot = '.MuiPaper-root'
    const uiCard = '[data-testid="UICard"]'
    const tablistButton = '[role="tablist"]>button'
    const callerCard = '[data-testid="phoning-caller-container"]>div'
    cy.contains('Responsable Phoning').click()
    cy.contains('Phoning').click()

    cy.url().should('eq', 'http://localhost:3000/phoning')
    cy.get(paperRoot).eq(1).contains('13')
    cy.get(paperRoot).eq(2).contains('Questionnaires')
    cy.get(paperRoot).eq(3).contains('75 sur un mois')

    cy.get('[data-testid="Campaigns-list-title"]').contains('Campagnes')
    cy.get(uiCard).eq(0).contains('Terminé')
    cy.get(uiCard)
      .eq(0)
      .contains(format(parseISO('2021-12-11T00:00:00+01:00'), 'dd MMMM yyyy', { locale: fr }))
    cy.get(uiCard).eq(0).contains('Admin • Equipe 1 (1)')
    cy.get(uiCard).eq(0).contains('0/50')
    cy.get(uiCard).eq(0).contains('voir').click()

    cy.url().should('eq', 'http://localhost:3000/phoning/11111111-1111-1111-1111-111111111111')
    cy.get('[data-testid="page-title"]').contains("Phoning > La campagne de l'inconnu")
    cy.get(paperRoot)
      .eq(1)
      .contains(
        `Du ${format(parseISO('2021-11-03T12:15:59+01:00'), 'dd/MM/yyyy', { locale: fr })} au ${format(
          parseISO('2021-11-30T00:00:00+01:00'),
          'dd/MM/yyyy',
          { locale: fr }
        )}`
      )
    cy.get(paperRoot).eq(2).contains('1/50')
    cy.get(paperRoot).eq(3).contains('Appels passés')
    cy.get(paperRoot).eq(4).contains('Passé par appel')
    cy.get(tablistButton).eq(0).contains('5 appelants')
    cy.get(tablistButton).eq(1).contains('4 appel')
    cy.get(tablistButton).eq(2).contains('0 questionnaire')
    cy.get(callerCard).eq(0).contains('1. John Doe')
    cy.get(callerCard).eq(1).contains('2/10')
  })

  it('loads national ripostes', () => {
    cy.contains('National').click()
    cy.contains('Riposte').click()

    cy.contains('Riposte 2')
    cy.contains('Par author 2')
    cy.contains('2 vues')
    cy.contains('2 vues détaillées')
    cy.contains('2 ripostes')

    cy.contains('Riposte 1')
    cy.contains('Par author 1')
    cy.contains('1 vue')
    cy.contains('1 vue détaillée')
    cy.contains('1 riposte')

    cy.contains('Éditer').first().click()
    const modale = 'div[role="dialog"]'
    cy.get(modale).contains('Modifier une riposte')
    cy.get(modale).get('input[name="title"]').should('have.value', 'Riposte 2')
    cy.get(modale).get('textarea[name="body"]').should('have.value', 'Répondez à Candidat X')
    cy.get(modale).get('input[name="url"]').should('have.value', 'https://www.en-marche.fr')
    cy.get(modale + ' button')
      .first()
      .click()
    cy.get(modale).should('not.exist')
  })
})
