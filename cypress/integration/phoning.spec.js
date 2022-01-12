import { initialization } from './main.spec'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

describe('Phoning', () => {
  beforeEach(() => {
    initialization()
  })

  it('loads phoning page successfully', () => {
    const paperRoot = '.MuiPaper-root'
    const uiCard = '[data-testid="UICard"]'
    cy.contains('Responsable Phoning').click()
    cy.contains('Phoning').click()

    cy.url().should('eq', 'http://localhost:3000/phoning')
    cy.get(paperRoot).eq(3).contains('13')
    cy.get(paperRoot).eq(4).contains('Questionnaires')
    cy.get(paperRoot).eq(5).contains('75 sur un mois')

    cy.get('[data-testid="Campaigns-title"]').contains('Campagnes')
    cy.get(uiCard).eq(0).contains('Terminé')
    cy.get(uiCard)
      .eq(0)
      .contains(format(parseISO('2021-12-11T00:00:00+01:00'), 'dd MMMM yyyy', { locale: fr }))
    cy.get(uiCard).eq(0).contains('Admin • Equipe 1 (1)')
    cy.get(uiCard).eq(0).contains('0/50')
    cy.get(uiCard).eq(0).contains('voir')
  })
})
