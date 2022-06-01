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


const Typography = '.MuiTypography-root'
const PageHeaderTitle = '[data-cy="ui-page-header"]'
const PageHeaderButton = '[data-cy="ui-page-header-button"]'
const MembersContainer = '[data-cy="my-team-members-container"]'
const MembersList = '[data-cy="my-team-members-list"]'
const MemberItemName = '[data-cy="my-team-member-item-name"]'
const MemberItemRole = '[data-cy="my-team-member-item-role"]'
const MemberItemAccessCount = '[data-cy="my-team-member-item-access-count"]'
const MemberActionButton = '[data-cy="my-team-member-action-view"]'
const UICard = '[data-cy="ui-card"]'
const isNotEmpty = value => expect(value.length).to.be.at.least(1)
const hasAtLeastOneItem = length => expect(length).to.be.at.least(1)

const navigate = () => {
  cy.contains('Référent').click()
  cy.contains('Mon équipe').click()
  cy.url().should('eq', 'http://localhost:3000/mon-equipe')
}

describe('My Team', () => {
  beforeEach(() => {
    initialize()
    mock('GET', '/api/v3/my_teams?scope=referent', 'my-team/my-team')

    navigate()
  })

  describe('The header', () => {
    it('should have a title', () => {
      cy.get(PageHeaderTitle).should('exist')
      cy.get(PageHeaderTitle).find('>div').find(Typography).first().should('have.text', 'Mon équipe').and('be.visible')
    })
    it('should have a clickable action button', () => {
      cy.get(PageHeaderButton).find('>button').should('exist')
      cy.get(PageHeaderButton).find('>button').click()
    })
  })

  describe('The content', () => {
    it('should have a list with at least 1 card', () => {
      cy.get(MembersContainer).find(MembersList).should('exist').children().its('length').then(hasAtLeastOneItem)
    })

    describe('The member item', () => {
      it('should show a full name', () => {
        cy.get(MembersContainer).find(MembersList).find(UICard).each(element => {
          cy.wrap(element).find(MemberItemName).should('exist').invoke('text').then(isNotEmpty)
          cy.wrap(element).find(MemberItemName).should('exist').invoke('text').then(isNotEmpty)
        })
      })
      it('should show a position', () => {
        cy.get(MembersContainer).find(MembersList).find(UICard).each(element => {
          cy.wrap(element).find(MemberItemRole).should('exist').invoke('text').then(isNotEmpty)
          cy.wrap(element).find(MemberItemRole).should('exist').invoke('text').then(isNotEmpty)
        })
      })
      it('should show the number of delegated accesses', () => {
        cy.get(MembersContainer).find(MembersList).find(UICard).each(element => {
          cy.wrap(element).find(MemberItemAccessCount).should('exist').invoke('text').then(isNotEmpty)
          cy.wrap(element).find(MemberItemAccessCount).should('exist').invoke('text').then(isNotEmpty)
        })
      })
      it('should show an update action button', () => {
        cy.get(MembersContainer).find(MembersList).find(UICard).each(element => {
          cy.wrap(element).find(MemberActionButton).find(Typography).should('exist').and('have.text', 'modifier')
        })
      })
    })
  })
})
