import { PostAddressModel } from '~/api/Procuration/procuration.model'

export const buildAddress = (address: PostAddressModel) =>
  address.country === 'FR'
    ? `${address.address}, ${address.postal_code} ${address.city_name}`
    : `${address.address}, ${address.country}-${address.postal_code} ${address.city_name}`
