import { render } from '@testing-library/react'
import UIContainer from './Container'

jest.mock('@mui/styles', () => ({
  makeStyles: () => () => ({ root: 'root' }),
}))
jest.mock('@mui/material', () => ({
  Grid: ({ item, children, ...props }) => <div {...props}>{children}</div>,
}))

describe('Container', () => {
  it('displays grid', () => {
    const { container } = render(<UIContainer rootClasses="fooClass">Foo</UIContainer>)

    expect(container).toMatchSnapshot()
  })
})
