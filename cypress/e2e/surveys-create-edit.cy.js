import { initialize, mock } from './main.cy'

const Typography = '.MuiTypography-root'
const PageHeaderButton = '[data-cy="ui-page-header-button"]'
const ModalContainer = '[data-cy="surveys-create-edit"]'
const ModalTitle = '[data-cy="surveys-create-edit-title"]'
const CTAButton = '[data-cy="surveys-create-edit-action-close"]'
const TitleLabel = '[data-cy="surveys-create-edit-title-label"]'
const TitleInput = '[data-cy="surveys-create-edit-title-input"]'
const TerritoryLabel = '[data-cy="surveys-create-edit-territory-label"]'
const TerritoryInput = '[data-cy="surveys-create-edit-territory-input"]'
const QuestionsLabel = '[data-cy="surveys-create-edit-questions-label"]'
const QuestionContentLabel = '[data-cy="surveys-create-edit-question-content-label"]'
const QuestionContentInput = '[data-cy="surveys-create-edit-question-content-input"]'
const QuestionDeleteButton = '[data-cy="surveys-create-edit-question-delete-button"]'
const QuestionAddButton = '[data-cy="surveys-create-edit-question-add-button"]'
const QuestionTypeLabel = '[data-cy="surveys-create-edit-question-type-label"]'
const QuestionTypeSimpleField = '[data-cy="surveys-create-edit-question-type-simple-field"]'
const QuestionTypeMultipleChoice = '[data-cy="surveys-create-edit-question-type-multiple-choice"]'
const QuestionTypeUniqueChoice = '[data-cy="surveys-create-edit-question-type-unique-choice"]'
const ChoicesLabel = '[data-cy="surveys-create-edit-choices-label"]'
const ChoiceInput = '[data-cy="surveys-create-edit-choice-input"]'
const ChoiceAddButton = '[data-cy="surveys-create-edit-choice-add-button"]'
const ChoiceDeleteButton = '[data-cy="surveys-create-edit-choice-delete-action"]'
const ValidateActionButton = '[data-cy="surveys-create-edit-submit"]'

const navigate = () => {
  cy.contains('Référent').click()
  cy.contains('Questionnaires').click()
  cy.url().should('eq', 'http://localhost:3000/questionnaires')

  cy.get(PageHeaderButton).find('>button').click()
}

describe('Surveys - Create Edit', () => {
  beforeEach(() => {
    initialize()
    mock('GET', '/api/v3/surveys?*', 'surveys/surveys')
    mock('GET', '/api/v3/surveys/kpi?scope=referent', 'surveys/surveys-kpi')
    navigate()
  })

  describe('The modal', () => {
    it('should have a title', () => {
      cy.get(ModalContainer).should('exist')
      cy.get(ModalContainer).find(ModalTitle).should('have.text', 'Créer un questionnaire local').and('be.visible')
    })

    it('should have a clickable close button', () => {
      cy.get(ModalContainer).find(CTAButton).should('exist')
      cy.get(ModalContainer).find(CTAButton).click({ force: true })
    })

    describe('The Title and Territory part', () => {
      it('should have 2 labels', () => {
        cy.get(ModalContainer).find(TitleLabel).should('exist').and('be.visible').and('have.text', 'Titre')
        cy.get(ModalContainer).find(TerritoryLabel).should('exist').and('be.visible').and('have.text', 'Territoire')
      })

      it('should have a fillable input', () => {
        cy.get(ModalContainer)
          .find(TitleInput)
          .find('input')
          .should('exist')
          .invoke('attr', 'name')
          .should('eq', 'title')
        cy.get(ModalContainer).find(TitleInput).find('input').type('My Title')
      })

      it('should have a no fillable input', () => {
        cy.get(ModalContainer)
          .find(TerritoryInput)
          .find('input')
          .should('exist')
          .invoke('attr', 'name')
          .should('eq', 'territory')
        cy.get(ModalContainer).find(TerritoryInput).find('input').should('be.disabled')
      })

      describe('The question part', () => {
        it('should have a label', () => {
          cy.get(ModalContainer).find(QuestionsLabel).should('exist')
          cy.get(ModalContainer).find(QuestionsLabel).should('have.text', 'Vos questions').and('be.visible')
        })

        it('should have one item by default', () => {
          cy.get(ModalContainer).find(QuestionContentInput).find('input').its('length').should('eq', 1)
        })

        it('should have a content label', () => {
          cy.get(ModalContainer)
            .find(QuestionContentLabel)
            .should('exist')
            .and('be.visible')
            .and('have.text', 'Question')
        })

        it('should have a content input', () => {
          cy.get(ModalContainer)
            .find(QuestionContentInput)
            .find('input')
            .should('exist')
            .invoke('attr', 'name')
            .should('eq', 'content')
          cy.get(ModalContainer).find(QuestionContentInput).find('input').type('My content')
        })

        it('should have a clickable delete button on the input', () => {
          cy.get(ModalContainer).find(QuestionDeleteButton).should('exist')
          cy.get(ModalContainer)
            .find(QuestionDeleteButton)
            .click()
            .then(() => {
              cy.get(ModalContainer).find(QuestionContentInput).find('input').its('length').should('eq', 1)
            })
        })

        it('should have a clickable add button below the input', () => {
          cy.get(ModalContainer).find(QuestionAddButton).should('exist')
          cy.get(ModalContainer)
            .find(QuestionAddButton)
            .find(Typography)
            .should('have.text', 'Ajouter une question')
            .and('be.visible')
          cy.get(ModalContainer)
            .find(QuestionAddButton)
            .click()
            .then(() => {
              cy.get(ModalContainer).find(QuestionContentInput).find('input').its('length').should('eq', 2)
            })
        })
      })

      describe('The question type part', () => {
        it('should have a label', () => {
          cy.get(ModalContainer).find(QuestionTypeLabel).should('exist')
          cy.get(ModalContainer).find(QuestionTypeLabel).should('have.text', 'Type de question').and('be.visible')
        })

        it('should have 3 selectable options', () => {
          cy.get(ModalContainer).find(QuestionTypeSimpleField).should('exist')
          cy.get(ModalContainer).find(QuestionTypeSimpleField).children().eq(0).click()
          cy.get(ModalContainer)
            .find(QuestionTypeSimpleField)
            .children()
            .eq(1)
            .should('have.text', 'Réponse libre')
            .and('be.visible')
          cy.get(ModalContainer).find(QuestionTypeMultipleChoice).should('exist')
          cy.get(ModalContainer).find(QuestionTypeMultipleChoice).children().eq(0).click()
          cy.get(ModalContainer)
            .find(QuestionTypeMultipleChoice)
            .children()
            .eq(1)
            .should('have.text', 'Choix multiples')
            .and('be.visible')
          cy.get(ModalContainer).find(QuestionTypeUniqueChoice).should('exist')
          cy.get(ModalContainer).find(QuestionTypeUniqueChoice).children().eq(0).click()
          cy.get(ModalContainer)
            .find(QuestionTypeUniqueChoice)
            .children()
            .eq(1)
            .should('have.text', 'Choix uniques')
            .and('be.visible')
        })
      })
    })

    describe('The choices part', () => {
      it('should not have any choice for a "simple field" question', () => {
        cy.get(ModalContainer)
          .find(QuestionTypeSimpleField)
          .children()
          .eq(0)
          .click()
          .then(() => {
            cy.get(ModalContainer).find(ChoicesLabel).should('not.exist')
            cy.get(ModalContainer).find(ChoiceInput).should('not.exist')
            cy.get(ModalContainer).find(ChoiceDeleteButton).should('not.exist')
            cy.get(ModalContainer).find(ChoiceAddButton).should('not.exist')
          })
      })

      it('should have 3 choices for a "multiple choices" question', () => {
        cy.get(ModalContainer)
          .find(QuestionTypeMultipleChoice)
          .children()
          .eq(0)
          .click()
          .then(() => {
            cy.get(ModalContainer).find(ChoicesLabel).should('exist').and('be.visible')
            cy.get(ModalContainer).find(ChoiceInput).should('exist').and('be.visible')
            cy.get(ModalContainer).find(ChoiceInput).its('length').should('eq', 3)
            cy.get(ModalContainer).find(ChoiceDeleteButton).should('exist').and('be.visible')
            cy.get(ModalContainer).find(ChoiceAddButton).should('exist').and('be.visible')
          })
      })

      it('should have 3 choices for a "unique choice" question', () => {
        cy.get(ModalContainer)
          .find(QuestionTypeUniqueChoice)
          .children()
          .eq(0)
          .click()
          .then(() => {
            cy.get(ModalContainer).find(ChoicesLabel).should('exist').and('be.visible')
            cy.get(ModalContainer).find(ChoicesLabel).should('exist').and('be.visible')
            cy.get(ModalContainer).find(ChoiceInput).should('exist').and('be.visible')
            cy.get(ModalContainer).find(ChoiceDeleteButton).should('exist').and('be.visible')
            cy.get(ModalContainer).find(ChoiceAddButton).should('exist').and('be.visible')
            cy.get(ModalContainer).find(ChoiceInput).its('length').should('eq', 3)
          })
      })

      it('should have a clickable delete button on the input', () => {
        cy.get(ModalContainer)
          .find(QuestionTypeMultipleChoice)
          .children()
          .eq(0)
          .click()
          .then(() => {
            cy.get(ModalContainer).find(ChoiceDeleteButton).should('exist')
            cy.get(ModalContainer)
              .find(ChoiceDeleteButton)
              .click()
              .then(() => {
                cy.get(ModalContainer).find(ChoiceInput).its('length').should('eq', 2)
              })
          })
      })

      it('should have a clickable add button below the input', () => {
        cy.get(ModalContainer)
          .find(QuestionTypeUniqueChoice)
          .children()
          .eq(0)
          .click()
          .then(() => {
            cy.get(ModalContainer).find(ChoiceAddButton).should('exist')
            cy.get(ModalContainer)
              .find(ChoiceAddButton)
              .find(Typography)
              .should('have.text', 'Ajouter un choix')
              .and('be.visible')
            cy.get(ModalContainer)
              .find(ChoiceAddButton)
              .click()
              .then(() => {
                cy.get(ModalContainer).find(ChoiceInput).its('length').should('eq', 4)
              })
          })
      })
    })

    describe('The form submission part', () => {
      it('should have a validation button', () => {
        cy.get(ModalContainer).find(ValidateActionButton).should('exist')
      })
    })
  })
})
