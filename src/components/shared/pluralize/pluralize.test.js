import pluralize from './pluralize'

describe('Pluralize', () => {
  it('pluralizes with an s without paramater', () => {
    const result = pluralize(3, 'foo')
    expect(result).toBe('foos')
  })

  it('pluralizes with an s with paramater', () => {
    const result = pluralize(3, 'foo', 's')
    expect(result).toBe('foos')
  })

  it('pluralizes with an x', () => {
    const result = pluralize(3, 'foo', 'x')
    expect(result).toBe('foox')
  })

  it('does not pluralize', () => {
    const result = pluralize(1, 'foo')
    expect(result).toBe('foo')
  })
})
