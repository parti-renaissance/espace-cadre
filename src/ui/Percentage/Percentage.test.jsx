import Percentage from '~/ui/Percentage/Percentage'
import { render } from '@testing-library/react'

describe('Percentage', () => {
  it('displays percentage from text', () => {
    const { container } = render(<Percentage>0.123456789</Percentage>)

    expect(container).toMatchSnapshot()
  })

  it('displays percentage from number', () => {
    const { container } = render(<Percentage>{0.123456789}</Percentage>)

    expect(container).toMatchSnapshot()
  })
})
