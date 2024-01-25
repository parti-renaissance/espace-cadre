import { render } from '@testing-library/react'
import Spinner from 'ui/Spinner/Spinner'

vi.mock('@mui/material', () => ({
  Grid: ({ children, container, item }) => (
    <div className={['mock-grid', container && 'container', item && 'item'].join(' ')}>{children}</div>
  ),
  CircularProgress: () => <div>mock-circular-progress</div>,
}))

describe('Spinner', () => {
  it('displays spinner', () => {
    const { container } = render(<Spinner />)

    expect(container).toMatchSnapshot()
  })
})
