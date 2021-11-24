import { render, screen, fireEvent } from '@testing-library/react'
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
  Collapse: ({ children }) => <div className="mock-collapse">{children}</div>,
  Paper: ({ children }) => <div className="mock-paper">{children}</div>,
}))
jest.mock('@mui/icons-material/Close', () => () => <div className="mock-close-icon"></div>)
jest.mock('@mui/icons-material/ExpandMore', () => () => <div className="mock-expand-more-icon"></div>)
jest.mock('components/shared/notification/hooks', () => ({
  useCustomSnackbar: () => ({ closeSnackbar: jest.fn() }),
}))

describe('SnackBar', () => {
  it('displays a SnackBar', () => {
    const mock = jest.fn()
    const { container } = render(<SnackBar id="id" message="message" variant="variant" dismissResolve={mock} />)

    expect(container).toMatchSnapshot()
  })

  it('displays a SnackBar with content', () => {
    const mock = jest.fn()
    const { container } = render(
      <SnackBar id="id" message="message" variant="variant" content="content" dismissResolve={mock} />
    )

    expect(container).toMatchSnapshot()
  })

  it('calls handleDismiss callback', () => {
    const mock = jest.fn()
    render(<SnackBar id="id" message="message" variant="variant" content="content" dismissResolve={mock} />)
    const [, button] = screen.getAllByTestId('icon-button')
    fireEvent.click(button)
    expect(mock).toHaveBeenCalled()
  })

  it('calls handleExpandToggle callback', () => {
    const mock = jest.fn()
    render(<SnackBar id="id" message="message" variant="variant" content="content" dismissResolve={mock} />)
    const [button] = screen.getAllByTestId('icon-button')
    fireEvent.click(button)
    expect(mock).toHaveBeenCalled()
  })
})
