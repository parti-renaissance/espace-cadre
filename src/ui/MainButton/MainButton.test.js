import { fireEvent, render, screen } from '@testing-library/react'
import Button from './MainButton'

jest.mock('@mui/system', () => ({
  styled: c => () => c,
}))

jest.mock('@mui/material', () => ({
  Button: ({ children, ...props }) => (
    <div data-testid="mui-button-mock" {...props}>
      {children}
    </div>
  ),
}))

describe('Button', () => {
  it('displays button', () => {
    const mock = jest.fn()
    const { container } = render(
      <Button onClick={mock} rootProps={{ sx: 'foo' }}>
        Foo
      </Button>
    )

    expect(container).toMatchSnapshot()
  })
  it('calls handleclick on click', () => {
    const mockOnClick = jest.fn()
    render(<Button onClick={mockOnClick}>Foo</Button>)

    const button = screen.getByTestId('mui-button-mock')
    fireEvent.click(button)
    expect(mockOnClick).toHaveBeenCalled()
  })
})
