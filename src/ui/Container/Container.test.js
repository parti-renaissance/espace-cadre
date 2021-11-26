import { render } from '@testing-library/react'
import UIContainer from './Container'

jest.mock('@mui/styles', () => ({
  makeStyles: () => () => ({ root: 'root' }),
}))
jest.mock('@mui/material', () => ({
  Grid: ({ item, children, ...props }) => <div {...props}>{children}</div>,
}))

describe('UIContainer', () => {
  it('displays grid', () => {
    const { container } = render(
      <UIContainer rootClasses="fooClass" xs={0} sm={1} md={2} lg={3} xl={4}>
        Foo
      </UIContainer>
    )

    expect(container).toMatchSnapshot()
  })
})
