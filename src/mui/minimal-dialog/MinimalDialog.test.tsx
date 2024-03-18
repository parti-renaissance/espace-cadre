import { act, fireEvent, render } from '@testing-library/react'
import MinimalDialog from '~/mui/minimal-dialog/MinimalDialog'
import { faker } from '@faker-js/faker'
import { expect } from 'vitest'
import { useState } from 'react'

describe('Minimal Dialog', () => {
  const payload = {
    title: faker.lorem.sentence(),
    body: faker.lorem.text(),
  }

  it('Should cycle', async () => {
    const TestElement = () => {
      const [isOpen, setIsOpen] = useState(true)

      return (
        <>
          <button onClick={() => setIsOpen(false)} data-testid={'button'}>
            close
          </button>
          <MinimalDialog title={payload.title} open={isOpen} data-testid={'dialog'} />
        </>
      )
    }

    const tree = render(<TestElement />)

    expect(await tree.findByTestId('dialog-title')).toBeTruthy()
    expect(await tree.findByText(payload.title)).toBeTruthy()

    act(() => {
      const btn = tree.getByTestId('button')
      expect(btn).toBeTruthy()

      fireEvent.click(btn)
    })

    let success = false
    try {
      await tree.findByTestId('dialog-title')
    } catch (e) {
      success = true
    }

    expect(success).toBeTruthy()
  })

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
