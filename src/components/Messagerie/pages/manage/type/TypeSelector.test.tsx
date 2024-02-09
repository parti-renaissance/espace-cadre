import TypeSelector from './TypeSelector'
import { fireEvent, render } from '@testing-library/react'
import { expect } from 'vitest'

import { CHOOSE_TYPE_TEST_ID } from '~/components/Messagerie/Component/ChooseType'
import { TYPE_CARD_TEST_ID } from '~/components/Messagerie/Component/TypeCard'

describe('ChooseType', () => {
  it('should render a choose type component', () => {
    const { getByTestId } = render(<TypeSelector />)
    expect(getByTestId(CHOOSE_TYPE_TEST_ID)).toBeDefined()
  })

  it('should render 2 type cards', () => {
    const { getAllByTestId } = render(<TypeSelector />)
    const cards = getAllByTestId(TYPE_CARD_TEST_ID)
    expect(cards.length).toBe(2)
  })

  it('should trigger onChange with correct id', () => {
    const handleChange = vi.fn()
    const { getAllByTestId } = render(<TypeSelector onChange={handleChange} />)
    const [actualityCard, newsletterCard] = getAllByTestId(TYPE_CARD_TEST_ID)
    fireEvent.click(actualityCard)
    expect(handleChange).toHaveBeenLastCalledWith('actuality')
    fireEvent.click(newsletterCard)
    expect(handleChange).toHaveBeenLastCalledWith('newsletter')
  })
})
