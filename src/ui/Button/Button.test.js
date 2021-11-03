import { render } from '@testing-library/react'
import Button from './Button'

jest.mock('@material-ui/core', () => ({
  Button: ({ children, ...props }) => (
    <div className="mui-button-mock" {...props}>
      {children}
    </div>
  ),
  makeStyles: () => () => ({ root: 'root' }),
}))

describe('Button', () => {
  it('displays button', () => {
    const mock = jest.fn()
    const { container } = render(
      <Button buttonClasses="fooClass" handleClick={mock}>
        Foo
      </Button>
    )

    expect(container).toMatchSnapshot()
  })
  it('displays disabled button', () => {
    const mock = jest.fn()
    const { container } = render(
      <Button buttonClasses="fooClass" handleClick={mock} disabled>
        Foo
      </Button>
    )

    expect(container).toMatchSnapshot()
  })
})
