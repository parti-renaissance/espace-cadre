import { fireEvent, render, screen } from '@testing-library/react'
import DotsMenu, { DotsMenuItem } from 'ui/Card/Menu/DotsMenu'

jest.mock('@mui/system', () => ({
  styled: c => () => c,
}))
jest.mock('@mui/icons-material/MoreVert', () => () => <div className="mui-MoreVertIcon-mock" />)
jest.mock('@mui/material', () => ({
  Button: ({ children }) => <div className="mui-button-mock">{children}</div>,
  IconButton: ({ children }) => <div className="mui-button-mock">{children}</div>,
  Menu: ({ children }) => <div className="mui-Menu-mock">{children}</div>,
  MenuItem: ({ children, onClick }) => (
    <div className="mui-MenuItem-mock" onClick={onClick} data-testid="mui-MenuItem-mock">
      {children}
    </div>
  ),
}))
describe('DotsMenu', () => {
  it('displays a DotsMenu', () => {
    const mockOnClick = jest.fn()
    const { container } = render(
      <DotsMenu>
        <DotsMenuItem onClick={mockOnClick}>foo</DotsMenuItem>
      </DotsMenu>
    )
    expect(container).toMatchSnapshot()
  })
  it('calls a mock when clicking on menu item', () => {
    const mockOnClick = jest.fn()
    render(
      <DotsMenu>
        <DotsMenuItem onClick={mockOnClick}>foo</DotsMenuItem>
      </DotsMenu>
    )

    const menuItem = screen.getByTestId('mui-MenuItem-mock')
    fireEvent.click(menuItem)
    expect(mockOnClick).toHaveBeenCalled()
  })
})
