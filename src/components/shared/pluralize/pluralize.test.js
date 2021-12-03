import pluralize from './pluralize'

describe('Pluralize', () => {
  it('pluralizes with an s', () => {
    const result = pluralize(3, 'foo')
    expect(result).toBe('foos')
  })

  it('does not pluralize', () => {
    const result = pluralize(1, 'foo')
    expect(result).toBe('foo')
  })
})
