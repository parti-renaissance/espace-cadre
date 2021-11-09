import { render } from '@testing-library/react'
import AlertBanner from 'ui/AlertBanner/AlertBanner'

jest.mock('@mui/lab/Alert', () => ({ children, ...rest }) => <div {...rest}>{children}</div>)
jest.mock('@mui/material', () => ({
  makeStyles: () => () => ({ errorMessage: 'errorMessage' }),
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
