import { render } from '@testing-library/react'
import UICard from './CardDeprecated'

jest.mock('@mui/material', () => ({
  Grid: ({ children }) => <div className="mui-grid-mock">{children}</div>,
  Paper: ({ children }) => <div className="mui-paper-mock">{children}</div>,
}))

jest.mock('@mui/styles', () => ({
  makeStyles: () => () => ({ root: 'root', container: 'container', title: 'title', creator: 'creator' }),
}))

describe('Card', () => {
  it('displays a Card', () => {
    const { container } = render(
      <UICard header="header" title="title" subtitle="subtitle">
        body
      </UICard>
    )
    expect(container).toMatchSnapshot()
  })
})
