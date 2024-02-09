import { render } from '@testing-library/react'
import { expect } from 'vitest'
import ChooseType from './ChooseType'

const props = {
  data: [
    {
      id: 1,
      icon: <div>icon</div>,
      title: 'title',
      subTitle: 'subTitle',
      description: 'description',
    },
    {
      id: 2,
      icon: <div>icon2</div>,
      title: 'title2',
      subTitle: 'subTitle2',
      description: 'description2',
    },
  ],
  render: vi.fn(() => <div data-testid="card">render</div>),
  onChange: vi.fn(),
  value: 1,
}

describe('ChooseType', () => {
  it('should render passed component', () => {
    const { getAllByTestId } = render(<ChooseType {...props} />)
    const cards = getAllByTestId('card')
    expect(cards.length).toBe(2)
  })

  it('should call onChange when clicked', () => {
    const { getAllByTestId, rerender } = render(<ChooseType {...props} />)
    const cards = getAllByTestId('card')
    cards[1].click()
    expect(props.onChange).toHaveBeenCalledWith(2)
    rerender(<ChooseType {...props} value={2} />)
    expect(props.render).toHaveBeenLastCalledWith({ selected: true, data: props.data[1] })
  })
})
