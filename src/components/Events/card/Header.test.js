import { formatAddress } from '~/components/Events/card/Header'
import { Place } from '~/domain/place'

describe('Header', () => {
  it('formats address 1', () => {
    const address = new Place(null, 'route', 'postalCode', 'city', null)
    expect(formatAddress(address)).toBe('route, postalCode city')
  })
  it('formats address 2', () => {
    const address = new Place(null, null, 'postalCode', 'city', null)
    expect(formatAddress(address)).toBe('postalCode city')
  })
  it('formats address 3', () => {
    const address = new Place(null, null, null, 'city', null)
    expect(formatAddress(address)).toBe('city')
  })
})
