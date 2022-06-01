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


const GroupCard = '[data-cy="ui-card"]'
const CreateGroupButton = '[data-cy="ui-page-header-button"]'
const DotActionButton = '[data-cy="dot-action-menu"]'
const CreateEditModal = '[data-testid="create-edit-modal"]'
const GroupTitleInput = '[data-cy="group-title-input"]'
const GroupAreaSelect = '[data-cy="group-area-select"]'

const navigate = () => {
  cy.contains('Référent').click()
  cy.contains('a', 'Groupes').click()
  cy.url().should('eq', 'http://localhost:3000/groupes')
}

describe('Groups', () => {
  beforeEach(() => {
    initialize()
    mock('GET', '/api/v3/teams?*', 'groups/groups')
    mock('GET', '/api/v3/teams/11111111-1111-1111-1111-111111111111?scope=referent', 'groups/1')
    navigate()
  })

  it('displays a title', () => {
    cy.contains('Groupes')
  })

  describe('Homepage', () => {
    it('displays two cards', () => {
      cy.get(GroupCard).should('have.length', 2)
    })

    it('displays cards with a chip, a title, a creator, a "Voir" button and an edit button', () => {
      cy.contains('1 militant')
      cy.contains('Group1')
      cy.contains('Voir')
      cy.get(DotActionButton).should('exist')
    })

    it('displays edition modal with data', () => {
      cy.get(DotActionButton).eq(0).click()
      cy.contains('Modifier').click()
      cy.get(CreateEditModal).contains('Modifier un groupe')
      cy.get(GroupTitleInput).find('>div').find('>input').should('have.value', 'Group1')
      cy.get(CreateEditModal).contains('Valider')
    })

    it('should have a "Voir" clickable button ', () => {
      cy.contains('Voir').first().click()
      cy.url().should('eq', 'http://localhost:3000/groupes/11111111-1111-1111-1111-111111111111/editer')
      cy.contains('firstname1 lastname1')
      cy.contains('92100, militant(e) depuis le ' + new Date(2019, 5, 1, 12, 0).toLocaleDateString())
    })
  
  })

  describe('Create modal', () => {
    it('displays a button to open a modal and create a group', () => {
      cy.get(CreateGroupButton).find('>button')
    })

    beforeEach(()=>{
      cy.get(CreateGroupButton).find('>button').click()
    })
    
    it('displays a form', () => {
      cy.contains('Créer un groupe')
      cy.contains('Nom (255 charactères)')
      cy.get(GroupTitleInput).should('have.value', '')
      cy.get(GroupAreaSelect).should('exist')
    })

    it('contains a button to close the modal', () => {
      cy.get(CreateEditModal).find('button').eq(0).click()
      cy.get(CreateEditModal).should('not.exist');
    })
  })
})
