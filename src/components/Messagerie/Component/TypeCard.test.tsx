import TypeCard from './TypeCard'
import { render } from '@testing-library/react'
import { expect } from 'vitest'

const props = {
  icon: <div>icon</div>,
  title: 'title',
  subTitle: 'subTitle',
  description: 'description',
}

describe('TypeCard', () => {
  it('displays the title', () => {
    const { getByText } = render(<TypeCard {...props} />)
    expect(getByText(props.title)).toBeDefined()
  })

  it('displays the subTitle', () => {
    const { getByText } = render(<TypeCard {...props} />)
    expect(getByText(props.subTitle)).toBeDefined()
  })

  it('displays the description', () => {
    const { getByText } = render(<TypeCard {...props} />)
    expect(getByText(props.description)).toBeDefined()
  })

  it('displays the icon', () => {
    const { getByText } = render(<TypeCard {...props} />)
    expect(getByText('icon')).toBeDefined()
  })
})
