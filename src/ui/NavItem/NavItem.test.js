import { render } from '@testing-library/react'
import NavItem from 'ui/NavItem/NavItem'

jest.mock('@mui/system', () => ({
  styled: c => () => c,
}))
jest.mock('@mui/material', () => ({
  Icon: ({ component }) => <div className="mock-icon">{component}</div>,
  Typography: ({ children }) => <div className="mock-typography">{children}</div>,
}))

jest.mock('react-router-dom', () => ({
  NavLink: ({ children }) => <div className="mock-navlink">{children}</div>,
}))

describe('NavItem', () => {
  it('displays a NavItem', () => {
    const { container } = render(<NavItem path="path" label="foo" color="color" bgColor="bgColor" icon="icon" />)

    expect(container).toMatchSnapshot()
  })
})
