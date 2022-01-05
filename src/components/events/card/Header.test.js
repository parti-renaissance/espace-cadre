import { Address } from 'domain/event'
import { formatAddress } from 'components/events/card/Header'

describe('Header', () => {
  it('formats address 1', () => {
    const address = new Address('rue', 'postalCode', 'city', null, null, null)
    expect(formatAddress(address)).toBe('rue, postalCode city')
  })
  it('formats address 2', () => {
    const address = new Address(null, 'postalCode', 'city', null, null, null)
    expect(formatAddress(address)).toBe('postalCode city')
  })
  it('formats address 3', () => {
    const address = new Address(null, null, 'city', null, null, null)
    expect(formatAddress(address)).toBe('city')
  })
})
