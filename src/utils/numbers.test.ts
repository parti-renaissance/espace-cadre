import { expect } from 'vitest'
import { formatToFrenchCurrencyString, formatToFrenchNumberString } from '~/utils/numbers'

describe('Number functions', () => {
  it('Should convert number to french display', () => {
    expect(formatToFrenchNumberString(1e3)).toBe('1\u202f000')
    expect(formatToFrenchNumberString(1000.5)).toBe('1\u202f000,5')
  })

  it('Should convert number to french currency display', () => {
    expect(formatToFrenchCurrencyString(1e3)).toBe('1\u202f000,00 €')
    expect(formatToFrenchCurrencyString(1000.5)).toBe('1\u202f000,50 €')
    expect(formatToFrenchCurrencyString(1000.4, 0)).toBe('1\u202f000 €')
    expect(formatToFrenchCurrencyString(1000.5, 0)).toBe('1\u202f001 €')
  })
})
