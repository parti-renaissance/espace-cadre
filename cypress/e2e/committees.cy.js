import { initialize, mock } from './main.cy'

const CommitteesGrid = '[data-cy="committees-grid"]'
const CommitteeCard = '[data-cy="committee-card"]'
const CommitteeAnimatorButton = '[data-cy="committee-add-animator"]'
const CommitteeElectionTab = '[data-cy="committee-detail-tab-elections"]'
const ElectionTabs = '[data-cy="committee-election-tabs"]'
const DialogModal = '[data-cy="modal-create-edit"]'
const DialogModalSubmitButton = '[data-cy="modal-create-edit-submit"]'
const DesignationCandidatureAddButton = '[data-cy="committee-add-designation-candidature-group"]'
const CandidaciesGroupsContainer = '[data-cy="committee-election-candidacies-groups-container"]'
const CandidaciesGroupCard = '[data-cy="candidacies-group-card"]'
const AutocompleteItem = '[data-cy="autocomplete-item"]'
const CandidatesListItem = '[data-cy="candidates-list-item"]'
const AddCandidateButton = '[data-cy="add-candidate-group"]'

const navigate = () => {
  cy.contains('Référent').click()
  cy.contains('Comités locaux').click()
  cy.url().should('eq', 'http://localhost:3000/comites')
}

const moveToDetail = () => {
  cy.get(CommitteeCard)
    .eq(0)
    .find('button')
    .eq(0)
    .click()

  cy.url().should('eq', 'http://localhost:3000/comites/5e00c264-1d4b-43b8-862e-29edc38389b3')
}

describe('Committees', () => {
  beforeEach(() => {
    initialize()
    mock('GET', '/api/v3/committees?page=1&page_size=20&scope=referent', 'committees/committees')
    mock('GET', '/api/v3/committees/5e00c264-1d4b-43b8-862e-29edc38389b3?scope=referent', 'committees/committee')
    mock('GET', '/api/v3/committees/used-zones?scope=referent', 'committees/used-zones')
    mock('PUT', '/api/v3/committees/5e00c264-1d4b-43b8-862e-29edc38389b3/animator?scope=referent', 'committees/committeeDetail/animator')
    mock('POST', '/api/v3/adherents/count?scope=referent', 'activists/counts')
    mock('GET', '/api/v3/designations/5eeda2a3-71a4-499b-a7d1-cf52ff2a7604?scope=referent', 'committees/committeeDetail/designations')

    navigate()
  })

  describe('the committees list with "closed" designation', () => {
    beforeEach(() => {
      mock('GET', '/api/v3/adherents/autocomplete?committee=5e00c264-1d4b-43b8-862e-29edc38389b3&renaissance_membership=adherent_re&q=Dimitri&scope=referent', 'autocomplete/adherents')
      mock('GET', '/api/v3/committee_elections/68742184-822f-4883-b00c-ec68dc09a7ff?scope=referent', 'committees/committeeDetail/committee-election')
      mock('GET', '/api/v3/designations/5eeda2a3-71a4-499b-a7d1-cf52ff2a7604/results?scope=referent', 'committees/committeeDetail/results')
    })

    it('can see the committees list', () => {
      cy.get(CommitteesGrid).find(CommitteeCard).children().should('have.length', 1)
    })

    it('should have a "Voir" clickable button ', () => {
      moveToDetail()

      cy.contains('Informations')
      cy.contains('Élections')
      cy.contains('Second Comité des 3 communes')
      cy.contains('Un petit comité avec seulement 3 communes')
    })

    it('can add "local animator" on comity', () => {
      moveToDetail()

      cy.get(CommitteeAnimatorButton).should('exist').click()
      cy.get(DialogModal).should('exist').then(() => {
        cy.get(DialogModal).find('input').type('Dimitri')
        cy.get(AutocompleteItem).eq(0).click()
        cy.get(DialogModalSubmitButton).click()
      })
    })

    it('can view elections tab', () => {
      moveToDetail()

      cy.get(CommitteeElectionTab)
        .should('exist')
        .click()

        cy.contains('Election CL Evry')
        cy.contains('Terminée')
        cy.get(ElectionTabs).should('exist')
    })
  })

  describe('committees with "not_started" designation', () => {
    beforeEach(() => {
      mock('GET', '/api/v3/adherents/autocomplete?committee=5e00c264-1d4b-43b8-862e-29edc38389b3&q=Dimitri&scope=referent', 'autocomplete/adherents')
      mock('GET', '/api/v3/committee_elections/68742184-822f-4883-b00c-ec68dc09a7ff?scope=referent', 'committees/committeeDetail/committee-election-not-started')
      mock('POST', '/api/v3/committee_candidacies_groups?scope=referent', 'committees/committeeDetail/candidacies-groups')
      mock('POST', '/api/v3/committee_candidacies?scope=referent', 'committees/committeeDetail/candidacies')
      mock('GET', '/api/v3/designations/5eeda2a3-71a4-499b-a7d1-cf52ff2a7604/results?scope=referent', 'committees/committeeDetail/no-results')
    })

    it('can view elections tab', () => {
      moveToDetail()

      cy.get(CommitteeElectionTab)
        .should('exist')
        .click()

        cy.contains('Election CL Evry')
        cy.contains('A venir')
        cy.get(ElectionTabs).should('exist')
    })

    it('can add candidacies groups and candidates', () => {
      moveToDetail()

      cy.get(CommitteeElectionTab).should('exist').click()
      cy.get(DesignationCandidatureAddButton).click()

      cy.get(CandidaciesGroupsContainer).find('> div').should('have.length', 2)
      cy.get(CandidaciesGroupCard)
        .eq(0)
        .find('> div + div')
        .click()
      cy.contains('Les candidats')

      cy.get(CandidaciesGroupCard)
        .eq(0)
        .find('> div + div')
        .find(AddCandidateButton)
        .click()

      cy.get(DialogModal).should('exist').then(() => {
        cy.get(DialogModal).find('input').type('Dimitri')
        cy.get(AutocompleteItem).eq(0).click()
        cy.get(DialogModalSubmitButton).click()
      })

      cy.get(CandidaciesGroupsContainer)
        .find(CandidatesListItem)
        .eq(0)
        .children()
        .should('have.length', 1)
    })
  })

  describe('committees with "scheduled" designation', () => {
    beforeEach(() => {
      mock('GET', '/api/v3/committee_elections/68742184-822f-4883-b00c-ec68dc09a7ff?scope=referent', 'committees/committeeDetail/committee-election-scheduled')
      mock('GET', '/api/v3/designations/5eeda2a3-71a4-499b-a7d1-cf52ff2a7604/results?scope=referent', 'committees/committeeDetail/no-results')
    })

    it('can view elections tab', () => {
      moveToDetail()

      cy.get(CommitteeElectionTab)
        .should('exist')
        .click()

        cy.contains('Election CL Evry')
        cy.contains('Planifiée')
        cy.get(ElectionTabs).should('exist')
    })
  })
})
