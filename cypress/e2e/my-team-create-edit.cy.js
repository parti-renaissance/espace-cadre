import { initialize, mock } from './main.cy'

const Typography = '.MuiTypography-root'
const PageHeaderButton = '[data-cy="ui-page-header-button"]'
const Checkbox = '[data-cy="ui-checkbox"]'
const ModalContainer = '[data-cy="my-team-create-edit"]'
const Title = '[data-cy="my-team-create-edit-title"]'
const CTAButton = '[data-cy="my-team-create-edit-action-close"]'
const ActivistLabel = '[data-cy="my-team-create-edit-activist-label"]'
const ActivistInput = '[data-cy="my-team-create-edit-activist-input"]'
const RoleLabel = '[data-cy="my-team-create-edit-role-label"]'
const RoleInput = '[data-cy="my-team-create-edit-role-input"]'
const DelegatedAccessesHeader = '[data-cy="my-team-create-edit-delegated-accesses-header"]'
const DelegatedAccessesFeatures = '[data-cy="my-team-create-edit-delegated-accesses-features"]'
const Feature = '[data-cy="my-team-create-edit-feature"]'
const ValidateActionButton = '[data-cy="my-team-member-action-submit"]'
const isNotEmpty = value => expect(value.length).to.be.at.least(1)
const hasAtLeastOneItem = length => expect(length).to.be.at.least(1)

const navigate = () => {
  cy.contains('Référent').click()
  cy.contains('Mon équipe').click()
  cy.url().should('eq', 'http://localhost:3000/mon-equipe')

  cy.get(PageHeaderButton).find('>button').click()
}

describe('My Team - Create Edit', () => {
  beforeEach(() => {
    initialize()
    mock('GET', '/api/v3/my_teams?scope=referent', 'my-team/my-team')

    navigate()
  })

  describe('The modal', () => {
    it('should have a title', () => {
      cy.get(ModalContainer).should('exist')
      cy.get(ModalContainer).find(Title).should('have.text', 'Ajouter un membre à mon équipe').and('be.visible')
    })
    it('should have a clickable action button', () => {
      cy.get(ModalContainer).find(CTAButton).should('exist')
      cy.get(ModalContainer).find(CTAButton).click({ force: true })
    })

    describe('The Activist and Role block', () => {
      it('should have 2 inputs', () => {
        cy.get(ModalContainer)
          .find(ActivistInput)
          .should('exist')
          .find('input')
          .invoke('attr', 'name')
          .should('eq', 'activist')
        cy.get(ModalContainer).find(RoleInput).should('exist').find('input').invoke('attr', 'name').should('eq', 'role')
      })

      describe('The activist part', () => {
        it('should show a label', () => {
          cy.get(ModalContainer).find(ActivistLabel).should('exist').contains('Militant').and('be.visible')
        })
        it('should show a fillable input', () => {
          cy.get(ModalContainer).find(ActivistInput).should('exist').type('a')
        })
      })

      describe('The role part', () => {
        it('should show a label', () => {
          cy.get(ModalContainer).find(RoleLabel).should('exist').invoke('text').then(isNotEmpty)
        })
        it('should show a fillable input', () => {
          cy.get(ModalContainer).find(RoleInput).should('exist').type('resp')
        })
      })
    })

    describe('The delegated accesses block', () => {
      it('should have 2 parts', () => {
        cy.get(ModalContainer).find(DelegatedAccessesHeader).should('exist')
        cy.get(ModalContainer).find(DelegatedAccessesFeatures).should('exist')
      })

      describe('The header part', () => {
        it('should show a header title with context information', () => {
          cy.get(ModalContainer)
            .find(DelegatedAccessesHeader)
            .find('>div')
            .find(Typography)
            .its('length')
            .should('eq', 2)
          cy.get(ModalContainer)
            .find(DelegatedAccessesHeader)
            .find('>div')
            .find(Typography)
            .eq(0)
            .should('have.text', 'Accès délégués')
          cy.get(ModalContainer)
            .find(DelegatedAccessesHeader)
            .find('>div')
            .find(Typography)
            .eq(1)
            .should('have.text', '(optionnel)')
        })
        it('should show a header description', () => {
          const disclaimer =
            'En déléguant vos accès, ce membre de votre équipe agira en votre nom depuis cet espace d’administration.'
          cy.get(ModalContainer).find(DelegatedAccessesHeader).children().eq(1).should('exist')
          cy.get(ModalContainer).find(DelegatedAccessesHeader).children().eq(1).should('have.text', disclaimer)
        })
      })

      describe('The features part', () => {
        it('should have at least 1 item', () => {
          cy.get(ModalContainer)
            .find(DelegatedAccessesFeatures)
            .find(Checkbox)
            .should('exist')
            .its('length')
            .then(hasAtLeastOneItem)
        })

        describe('Each item', () => {
          it('should show a clickable checkbox', () => {
            cy.get(ModalContainer).find(DelegatedAccessesFeatures).find(Checkbox).eq(0).find('>input').should('exist')
            cy.get(ModalContainer)
              .find(DelegatedAccessesFeatures)
              .find(Checkbox)
              .eq(0)
              .find('>input')
              .click()
              .then(element => {
                cy.wrap(element).should('have.value', 'true')
              })
          })
          it('should show a label', () => {
            cy.get(ModalContainer)
              .find(DelegatedAccessesFeatures)
              .find(Feature)
              .find('>span')
              .eq(1)
              .should('exist')
              .invoke('text')
              .then(isNotEmpty)
          })
        })
      })
    })

    describe('The form submission part', () => {
      it('should have a validation button', () => {
        cy.get(ModalContainer).find(ValidateActionButton).find('>button').should('exist')
      })
    })
  })
})
