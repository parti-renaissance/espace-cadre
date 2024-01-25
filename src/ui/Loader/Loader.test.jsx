import { render } from '@testing-library/react'
import Loader from 'ui/Loader/Loader'

vi.mock('@mui/material', () => ({
  CircularProgress: ({ size }) => <div>Mock CircularProgress: size {size}</div>,
}))

describe('Loader', () => {
  it('displays Loader', () => {
    const { container } = render(<Loader />)

    expect(container).toMatchSnapshot()
  })
})
