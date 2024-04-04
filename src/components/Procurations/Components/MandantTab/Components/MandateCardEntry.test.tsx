import { faker } from '@faker-js/faker'
import { render } from '@testing-library/react'
import MandateCardEntry from '~/components/Procurations/Components/MandantTab/Components/MandateCardEntry'
import { expect } from 'vitest'

describe('Mandate card entry', () => {
  const payload = {
    title: faker.lorem.sentence(2),
    value: faker.lorem.sentence(2),
  }

  it('Should write line', async () => {
    const tree = render(<MandateCardEntry title={payload.title} value={payload.value} />)

    expect(await tree.findByText(payload.title)).toBeTruthy()
    expect(await tree.findByText(payload.value)).toBeTruthy()
  })
})
