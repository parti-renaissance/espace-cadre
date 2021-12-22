import { render } from '@testing-library/react'
import Button from './MainButton'

jest.mock('@mui/styles', () => ({
  makeStyles: () => () => ({ root: 'root' }),
}))
jest.mock('@mui/material', () => ({
  Button: ({ children, ...props }) => (
    <div className="mui-button-mock" {...props}>
      {children}
    </div>
  ),
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
