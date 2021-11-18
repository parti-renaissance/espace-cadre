import TextField from 'ui/TextField'
import { render } from '@testing-library/react'

jest.mock('@material-ui/core', () => ({
  TextField: ({ fullWidth, multiline, inputProps, ...props }) => <div className="mui-TextField-mock" {...props} />,
  makeStyles: () => () => ({ textField: 'textField' }),
}))

jest.mock('ui/AlertBanner', () => ({ children, ...rest }) => (
  <div className="AlertBannerMock" {...rest}>
    {children}
  </div>
))

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
