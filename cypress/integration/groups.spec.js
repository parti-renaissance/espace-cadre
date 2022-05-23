import { initialize, mock } from './main.spec'

const groupCard = '[data-cy="ui-card"]'
const createGroupButton = '[data-cy="ui-page-header-button"]'
const dotActionButton = '[data-cy="dot-action-menu"]'
const createEditModal = '[data-testid="create-edit-modal"]'
const groupTitleInput = '[data-cy="group-title-input"]'
const groupAreaSelect = '[data-cy="group-area-select"]'

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
      cy.get(groupCard).should('have.length', 2)
    })

    it('displays cards with a chip, a title, a creator, a "Voir" button and an edit button', () => {
      cy.contains('1 militant')
      cy.contains('Group1')
      cy.contains('Voir')
      cy.get(dotActionButton).should('exist')
    })

    it('displays edition modal with data', () => {
      cy.get(dotActionButton).eq(0).click()
      cy.contains('Modifier').click()
      cy.get(createEditModal).contains('Modifier un groupe')
      cy.get(groupTitleInput).find('>div').find('>input').should('have.value', 'Group1')
      cy.get(createEditModal).contains('Valider')
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
      cy.get(createGroupButton).find('>button')
    })

    beforeEach(()=>{
      cy.get(createGroupButton).find('>button').click()
    })
    
    it('displays a form', () => {
      cy.contains('Créer un groupe')
      cy.contains('Nom (255 charactères)')
      cy.get(groupTitleInput).should('have.value', '')
      cy.get(groupAreaSelect).should('exist')
    })

    it('contains a button to close the modal', () => {
      cy.get(createEditModal).find('button').eq(0).click()
      cy.get(createEditModal, { timeout: 1000 }).should('not.exist');
    })
  })
})
