import { render } from '@testing-library/react'
import UIContainer from './UIContainer'

jest.mock('@material-ui/core', () => ({
  Grid: ({ item, children, ...props }) => <div {...props}>{children}</div>,
  makeStyles: () => () => ({ root: 'root' }),
}))

describe('Grid', () => {
  it('displays grid', () => {
    const { container } = render(
      <UIContainer rootClasses="fooClass" xs={0} sm={1} md={2} lg={3} xl={4}>
        Foo
      </UIContainer>
    )

    expect(container).toMatchSnapshot()
  })
})
