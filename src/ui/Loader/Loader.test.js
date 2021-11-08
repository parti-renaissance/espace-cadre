import { render } from '@testing-library/react'
import Loader from 'ui/Loader/Loader'

describe('Loader', () => {
  it('displays Loader', () => {
    const { container } = render(<Loader />)

    expect(container).toMatchSnapshot()
  })
})
