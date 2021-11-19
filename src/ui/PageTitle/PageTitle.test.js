import { render } from '@testing-library/react'
import PageTitle from './PageTitle'

jest.mock('@mui/styles', () => ({
  makeStyles: () => () => ({ title: 'title' }),
}))
jest.mock('@mui/material', () => ({
  Grid: ({ children, breakpoints }) => <div xs={breakpoints}>{children}</div>,
}))

describe('PageTitle', () => {
  it('displays a title', () => {
    const { container } = render(<PageTitle title="Title for test" xs={0} />)

    expect(container).toMatchSnapshot()
  })
})
