import { render } from '@testing-library/react'
import MandatePeopleNumber from '~/components/Mandates/Components/MandantTab/Components/MandatePeopleNumber'
import { faker } from '@faker-js/faker'
import { expect } from 'vitest'

describe('Mandate People Number', () => {
  const counter = faker.number.int({
    min: 0,
    max: 99,
  })

  it('Should show counter', async () => {
    const tree = render(<MandatePeopleNumber count={counter} />)

    const target = await tree.findByTestId('count')
    expect(target).toBeTruthy()
    expect(target.innerHTML).toBe(counter.toString(10))
  })

  it('Should show pluralized', () => {
    const tree = render(<MandatePeopleNumber count={2} />)
    expect(tree.queryByText('Mandataires')).toBeTruthy()
  })

  it('Should show singular', () => {
    const tree = render(<MandatePeopleNumber count={1} />)
    expect(tree.queryByText('Mandataires')).toBeFalsy()
    expect(tree.queryByText('Mandataire')).toBeTruthy()
  })
})
