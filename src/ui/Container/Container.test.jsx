import { render } from '@testing-library/react'
import UIContainer from './Container'

vi.mock('@mui/material', () => ({
  Grid: ({ children, sx }) => <div data-sx={sx}>{children}</div>,
}))
vi.mock('@mui/system', () => ({
  styled: c => () => c,
}))

describe('Container', () => {
  it('displays grid', () => {
    const { container } = render(<UIContainer rootProps={{ sx: 'foo' }}>Foo</UIContainer>)

    expect(container).toMatchSnapshot()
  })
})
