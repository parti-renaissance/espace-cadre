import { render } from '@testing-library/react'
import PageTitle from './PageTitle'

vi.mock('@mui/material', () => ({
  Grid: ({ children }) => <div>{children}</div>,
  Typography: ({ children }) => <div className="typography">{children}</div>,
}))
vi.mock('react-router-dom', () => ({
  Link: ({ to, children }) => (
    <div className="Link" data-to={to}>
      {children}
    </div>
  ),
}))

describe('PageTitle', () => {
  it('displays only a title', () => {
    const { container } = render(<PageTitle title="Title for test" breakpoints={{ xs: 0 }} />)

    expect(container).toMatchSnapshot()
  })

  it('displays a breadcrumbs', () => {
    const { container } = render(
      <PageTitle title="Title for test" titleLink="titleLink" titleSuffix="titleSuffix" breakpoints={{ xs: 0 }} />
    )

    expect(container).toMatchSnapshot()
  })
})
