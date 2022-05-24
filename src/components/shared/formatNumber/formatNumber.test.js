import formatNumber from './formatNumber'

describe('formatNumber', () => {
  it('add space between number', () => {
    const result = formatNumber(12450)
    expect(result).toBe('12 450')
  })
})
