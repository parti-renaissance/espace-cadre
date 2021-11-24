import { fireEvent, render, screen } from '@testing-library/react'
import SnackBar from 'ui/SnackBar/SnackBar'

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
}))
jest.mock('notistack', () => ({
  SnackbarContent: ({ children }) => <div className="mock-snackbar-content">{children}</div>,
}))
jest.mock('@mui/system', () => ({
  styled: c => () => c,
}))
jest.mock('@mui/material', () => ({
  Card: ({ children }) => <div className="mock-card">{children}</div>,
  CardActions: ({ children, variant }) => <div className={`mock-card-actions ${variant}`}>{children}</div>,
  Grid: ({ children }) => <div className="mock-grid">{children}</div>,
  Typography: ({ children }) => <div className="mock-typography">{children}</div>,
  IconButton: ({ children, onClick }) => (
    <div className="mock-icon-button" data-testid="icon-button" onClick={onClick}>
      {children}
    </div>
  ),
  Collapse: ({ children, in: _in }) => <div className="mock-collapse">{_in && children}</div>,
  Paper: ({ children }) => <div className="mock-paper">{children}</div>,
}))
jest.mock('@mui/icons-material/Close', () => () => <div className="mock-close-icon" />)
jest.mock('@mui/icons-material/ExpandMore', () => () => <div className="mock-expand-more-icon" />)
const mockCloseSnackbar = jest.fn()
jest.mock('components/shared/notification/hooks', () => ({
  useCustomSnackbar: () => ({ closeSnackbar: mockCloseSnackbar }),
}))

describe('SnackBar', () => {
  it('displays a SnackBar', () => {
    const mockDismiss = jest.fn()
    const { container } = render(<SnackBar id="id" message="message" variant="variant" dismissResolve={mockDismiss} />)

    expect(container).toMatchSnapshot()
  })

  it('displays a SnackBar with content', () => {
    const mockDismiss = jest.fn()
    const { container } = render(
      <SnackBar
        id="id"
        message="message"
        variant="variant"
        content={<div data-testid="content" />}
        dismissResolve={mockDismiss}
      />
    )

    const [toggleContent] = screen.getAllByTestId('icon-button')
    fireEvent.click(toggleContent)
    expect(container).toMatchSnapshot()
  })

  it('calls handleDismiss callback', () => {
    const mockDismiss = jest.fn()
    render(<SnackBar id="id" message="message" variant="variant" content="content" dismissResolve={mockDismiss} />)
    const [, dismissButton] = screen.getAllByTestId('icon-button')
    fireEvent.click(dismissButton)
    expect(mockDismiss).toHaveBeenCalled()
    expect(mockCloseSnackbar).toHaveBeenCalled()
  })

  it('displays/hides content on click', () => {
    const mockDismiss = jest.fn()
    render(
      <SnackBar
        id="id"
        message="message"
        variant="variant"
        content={<div data-testid="content" />}
        dismissResolve={mockDismiss}
      />
    )

    expect(screen.queryByTestId('content')).toBeFalsy()

    const [toggleContent] = screen.getAllByTestId('icon-button')
    fireEvent.click(toggleContent)
    screen.getByTestId('content')

    fireEvent.click(toggleContent)
    expect(screen.queryByTestId('content')).toBeFalsy()
  })
})
