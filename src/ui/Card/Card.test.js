import { render } from '@testing-library/react'
import Card from './Card'

jest.mock('@material-ui/core', () => ({
  Grid: ({ item, children, ...props }) => <div {...props}>{children}</div>,
  makeStyles: () => () => ({ root: 'root' }),
}))

describe('Card', () => {
  it('displays card', () => {
    const { container } = render(
      <Card rootClasses="fooClass" xs={0} sm={1} md={2} lg={3} xl={4}>
        Foo
      </Card>
    )

    expect(container).toMatchSnapshot()
  })
})
