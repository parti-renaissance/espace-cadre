import { render } from '@testing-library/react'
import UICard from './Card'

jest.mock('@mui/system', () => ({
  styled: c => () => c,
}))
jest.mock('@mui/material', () => ({
  Box: ({ children }) => <div className="mui-box-mock">{children}</div>,
}))
describe('Card', () => {
  it('displays a Card with headers', () => {
    const { container } = render(<UICard headerTitle="header" headerSubtitle="subtitle" />)
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
