import { fireEvent, render, screen } from '@testing-library/react'
import SnackBar from '~/ui/SnackBar/SnackBar'

vi.mock('react-redux', () => ({
  useDispatch: () => vi.fn(),
}))
vi.mock('notistack', () => ({
  SnackbarContent: ({ children }) => <div className="mock-snackbar-content">{children}</div>,
}))
vi.mock('@mui/system', () => ({
  styled: c => () => c,
}))
vi.mock('@mui/material', () => ({
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
vi.mock('@mui/icons-material/Close', () => ({ default: () => <div className="mock-close-icon" /> }))
vi.mock('@mui/icons-material/ExpandMore', () => ({ default: () => <div className="mock-expand-more-icon" /> }))
const mockCloseSnackbar = vi.fn()
vi.mock('~/components/shared/notification/hooks', () => ({
  useCustomSnackbar: () => ({ closeSnackbar: mockCloseSnackbar }),
}))

describe('SnackBar', () => {
  it('displays a SnackBar', () => {
    const mockDismiss = vi.fn()
    const { container } = render(<SnackBar id="id" message="message" variant="variant" dismissResolve={mockDismiss} />)

    expect(container).toMatchSnapshot()
  })

  it('displays a SnackBar with content', () => {
    const mockDismiss = vi.fn()
    const { container } = render(
      <SnackBar id="id" message="message" variant="variant" dismissResolve={mockDismiss}>
        <div data-testid="content" />
      </SnackBar>
    )

    const [toggleContent] = screen.getAllByTestId('icon-button')
    fireEvent.click(toggleContent)
    expect(container).toMatchSnapshot()
  })

  it('calls handleDismiss callback', () => {
    const mockDismiss = vi.fn()
    render(
      <SnackBar id="id" message="message" variant="variant" dismissResolve={mockDismiss}>
        <div data-testid="content" />
      </SnackBar>
    )
    const [, dismissButton] = screen.getAllByTestId('icon-button')
    fireEvent.click(dismissButton)
    expect(mockDismiss).toHaveBeenCalled()
    expect(mockCloseSnackbar).toHaveBeenCalled()
  })

  it('displays/hides content on click', () => {
    const mockDismiss = vi.fn()
    render(
      <SnackBar id="id" message="message" variant="variant" dismissResolve={mockDismiss}>
        <div data-testid="content" />
      </SnackBar>
    )

    expect(screen.queryByTestId('content')).toBeFalsy()

    const [toggleContent] = screen.getAllByTestId('icon-button')
    fireEvent.click(toggleContent)
    screen.getByTestId('content')

    fireEvent.click(toggleContent)
    expect(screen.queryByTestId('content')).toBeFalsy()
  })
})
