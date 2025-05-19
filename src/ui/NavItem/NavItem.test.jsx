import { render } from '@testing-library/react'
import NavItem from '~/ui/NavItem/NavItem'

vi.mock('@mui/system', () => ({
  styled: c => () => c,
}))
vi.mock('@mui/material', () => ({
  Typography: ({ children }) => <div className="mock-typography">{children}</div>,
  Box: ({ children }) => <div className="mock-box">{children}</div>,
  Chip: ({ children }) => <div className="mock-chip">{children}</div>,
}))

vi.mock('react-router-dom', () => ({
  NavLink: ({ children }) => <div className="mock-navlink">{children}</div>,
}))

describe('NavItem', () => {
  it('displays a NavItem', () => {
    const { container } = render(<NavItem path="path" label="foo" />)

    expect(container).toMatchSnapshot()
  })
})
