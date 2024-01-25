import { render } from '@testing-library/react'
import UICard from 'ui/Card/Card'

jest.mock('@mui/system', () => ({
  styled: c => () => c,
}))
jest.mock('@mui/material', () => ({
  Paper: ({ children }) => <div className="mui-paper-mock">{children}</div>,
}))
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
