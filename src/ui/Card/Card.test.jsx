import { render } from '@testing-library/react'
import UICard from './Card'

vi.mock('@mui/system', () => ({
  styled: c => () => c,
}))

vi.mock('@mui/material', async importOriginal => {
  const actual = await importOriginal()
  return {
    ...actual,
    Paper: ({ children }) => <div className="mui-paper-mock">{children}</div>,
    // your mocked methods
  }
})
describe('Card', () => {
  it('displays a Card with headers', () => {
    const { container } = render(<UICard header="header" />)
    expect(container).toMatchSnapshot()
  })

  it('displays a Card with content', () => {
    const { container } = render(<UICard content="content" />)
    expect(container).toMatchSnapshot()
  })

  it('displays a Card with actions', () => {
    const { container } = render(<UICard actions="actions" />)
    expect(container).toMatchSnapshot()
  })
})
