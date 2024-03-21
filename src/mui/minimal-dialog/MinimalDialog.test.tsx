import { render } from '@testing-library/react'
import MinimalDialog from '~/mui/minimal-dialog/MinimalDialog'
import { faker } from '@faker-js/faker'
import { expect } from 'vitest'

describe('Minimal Dialog', () => {
  const payload = {
    title: faker.lorem.sentence(),
    body: faker.lorem.text(),
  }

  it('Should have a title', async () => {
    const tree = render(<MinimalDialog title={payload.title} open={true} />)

    expect(await tree.findByTestId('dialog-title')).toBeTruthy()
    expect(await tree.findByText(payload.title)).toBeTruthy()
  })

  it('Should have a content', async () => {
    const tree = render(
      <MinimalDialog title={payload.title} open={true}>
        <p data-testid={'dialog-content'}>{payload.body}</p>
      </MinimalDialog>
    )

    expect(await tree.findByTestId('dialog-title')).toBeTruthy()
    expect(await tree.findByText(payload.title)).toBeTruthy()
  })
})
