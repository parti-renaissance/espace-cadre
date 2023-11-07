import { initialize, mock } from './main.cy'

describe('Dashboard', () => {
  beforeEach(() => {
    initialize()
    mock('GET', '/api/v3/adherents/count?scope=*', 'internal/adherents')
    mock('GET', '/api/v3/adherent_messages/kpi?scope=*', 'internal/reportsRatio')
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
})
