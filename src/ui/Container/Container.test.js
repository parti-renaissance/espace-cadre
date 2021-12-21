import { render } from '@testing-library/react'
import UIContainer from './Container'

jest.mock('@mui/material', () => ({
  Grid: ({ children, ...props }) => <div data-sx={props.sx}>{children}</div>,
}))

describe('Container', () => {
  it('displays grid', () => {
    const { container } = render(<UIContainer rootProps={{ sx: 'foo' }}>Foo2</UIContainer>)

    expect(container).toMatchSnapshot()
  })
})
