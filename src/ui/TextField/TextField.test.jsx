import TextField from './TextField'
import { render } from '@testing-library/react'

vi.mock('@mui/material', () => ({
  TextField: ({ fullWidth, multiline, inputProps, error, ...props }) => (
    <div className="mui-TextField-mock" {...props} />
  ),
}))
vi.mock('ui/AlertBanner', () => ({
  default: ({ children, ...rest }) => (
    <div className="AlertBannerMock" {...rest}>
      {children}
    </div>
  ),
}))

describe('TextField', () => {
  const formik = {
    touched: {
      foo: 'foo-touched',
    },
    errors: {
      foo: 'foo-errors',
    },
    values: {
      foo: 'foo-values',
    },
  }

  it('displays TextField', () => {
    const { container } = render(<TextField label="foo" formik={formik} />)

    expect(container).toMatchSnapshot()
  })
})
