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
    const tablistButton = '[role="tablist"]>button'
    const callerCard = '[data-testid="phoning-caller-container"]>div'
    cy.contains('Responsable Phoning').click()
    cy.contains('Phoning').click()

    cy.url().should('eq', 'http://localhost:3000/phoning')
    cy.get(paperRoot).eq(3).contains('13')
    cy.get(paperRoot).eq(4).contains('Questionnaires')
    cy.get(paperRoot).eq(5).contains('75 sur un mois')

    cy.get('[data-testid="Campaigns-list-title"]').contains('Campagnes')
    cy.get(uiCard).eq(0).contains('Terminé')
    cy.get(uiCard)
      .eq(0)
      .contains(format(parseISO('2021-12-11T00:00:00+01:00'), 'dd MMMM yyyy', { locale: fr }))
    cy.get(uiCard).eq(0).contains('Admin • Equipe 1 (1)')
    cy.get(uiCard).eq(0).contains('0/50')
    cy.get(uiCard).eq(0).contains('voir').click()

    cy.url().should('eq', 'http://localhost:3000/phoning/11111111-1111-1111-1111-111111111111')
    cy.get('[data-testid="page-title"]').contains('Phoning > Campagne 1')
    cy.get(paperRoot)
      .eq(3)
      .contains(
        `Du ${format(parseISO('2021-11-03T12:15:59+01:00'), 'dd/MM/yyyy', { locale: fr })} au ${format(
          parseISO('2021-11-30T00:00:00+01:00'),
          'dd/MM/yyyy',
          { locale: fr }
        )}`
      )
    cy.get(paperRoot).eq(4).contains('1/50')
    cy.get(paperRoot).eq(5).contains('Appels passés')
    cy.get(paperRoot).eq(6).contains('Passé par appel')
    cy.get(tablistButton).eq(0).contains('5 appelants')

    cy.get(tablistButton).eq(0).contains('5 appelants').click()
    cy.get(callerCard).eq(0).contains('1. John Doe')
    cy.get(callerCard).eq(1).contains('2/10')

    cy.get(tablistButton).eq(1).contains('4 appels')
    cy.get(tablistButton).eq(2).contains('2 questionnaires')
  })
})
