import { render } from '@testing-library/react'
import UICard from './Card'

jest.mock('@mui/material', () => ({
  Card: ({ children }) => <div className="mui-card-mock">{children}</div>,
  CardHeader: ({ title, subheader }) => (
    <div className="mui-cardheader-mock">
      {title}-{subheader}
    </div>
  ),
  CardContent: ({ children }) => <div className="mui-cardcontent-mock">{children}</div>,
  CardActions: ({ children }) => <div className="mui-cardactions-mock">{children}</div>,
}))
describe('Card', () => {
  it('displays a Card with headers', () => {
    const { container } = render(<UICard headerTitle="header" headerSubtitle="subtitle" />)
    expect(container).toMatchSnapshot()
  })

  it('displays a Card with content', () => {
    const { container } = render(<UICard content="content" />)
    expect(container).toMatchSnapshot()
  })

  it('displays a Card with actions', () => {
    const { container } = render(<UICard actions="actions" />)
    expect(container).toMatchSnapshot()
  })
})
