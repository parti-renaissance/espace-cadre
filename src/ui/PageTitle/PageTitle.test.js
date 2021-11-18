import { render } from '@testing-library/react'
import PageTitle from './PageTitle'

jest.mock('@material-ui/core', () => ({
  Grid: ({ children, breakpoints }) => <div xs={breakpoints}>{children}</div>,
  makeStyles: () => () => ({ title: 'title' }),
}))

describe('PageTitle', () => {
  it('displays a title', () => {
    const { container } = render(<PageTitle title="Title for test" xs={0} />)

    expect(container).toMatchSnapshot()
  })
})
