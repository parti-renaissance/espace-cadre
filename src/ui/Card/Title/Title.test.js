import { render } from '@testing-library/react'
import { Title } from 'ui/Card'

jest.mock('@mui/system', () => ({
  styled: c => () => c,
}))
jest.mock('@mui/material', () => ({
  Typography: ({ children }) => <div className="mui-typography-mock">{children}</div>,
}))
describe('Title', () => {
  it('displays a Title', () => {
    const { container } = render(<Title subject="subject" author="author" />)
    expect(container).toMatchSnapshot()
  })
})
