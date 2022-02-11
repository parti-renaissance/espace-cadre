import { render } from '@testing-library/react'
import PageTitle from './PageTitle'

jest.mock('@mui/material', () => ({
  Grid: ({ children, breakpoints }) => <div xs={breakpoints}>{children}</div>,
}))

describe('PageTitle', () => {
  it('displays only a title', () => {
    const { container } = render(<PageTitle title="Title for test" xs={0} />)

    expect(container).toMatchSnapshot()
  })

  it('displays a breadcrumbs', () => {
    const { container } = render(
      <PageTitle title="Title for test" titleLink="titleLink" titleSuffix="titleSuffix" xs={0} />
    )

    expect(container).toMatchSnapshot()
  })
})
