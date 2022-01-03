import { initialization } from './main.spec'

describe('Messagerie', () => {
  beforeEach(() => {
    initialization()
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
})
