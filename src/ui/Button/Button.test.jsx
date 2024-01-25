import { fireEvent, render, screen } from '@testing-library/react'
import Button from './Button'

vi.mock('@mui/system', () => ({
  styled: c => () => c,
}))

vi.mock('@mui/material', () => ({
  Button: ({ children, isMainbutton, ...props }) => (
    <div data-testid="mui-button-mock" {...props}>
      {children}
    </div>
  ),
}))

describe('Button', () => {
  it('displays button', () => {
    const mock = vi.fn()
    const { container } = render(
      <Button onClick={mock} rootProps={{ sx: 'foo' }}>
        Foo
      </Button>
    )

    expect(container).toMatchSnapshot()
  })
  it('calls handleclick on click', () => {
    const mockOnClick = vi.fn()
    render(<Button onClick={mockOnClick}>Foo</Button>)

    const button = screen.getByTestId('mui-button-mock')
    fireEvent.click(button)
    expect(mockOnClick).toHaveBeenCalled()
  })
})
