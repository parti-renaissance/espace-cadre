import { render } from '@testing-library/react'
import AlertBanner from 'ui/AlertBanner/AlertBanner'

jest.mock('@mui/styles', () => ({
  makeStyles: () => () => ({ errorMessage: 'errorMessage' }),
}))
jest.mock('@mui/material', () => ({
  Alert: ({ children, ...rest }) => <div {...rest}>{children}</div>,
}))

describe('AlertBanner', () => {
  it('displays AlertBanner with string message', () => {
    const { container } = render(<AlertBanner severity="foo-severity" message="FOO" />)

    expect(container).toMatchSnapshot()
  })
  it('displays AlertBanner with object message', () => {
    const { container } = render(<AlertBanner severity="foo-severity" message={{ message: 'FOO' }} />)

    expect(container).toMatchSnapshot()
  })
})
