export const dateFormatted = (address: string) =>
  new Date(address).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
  })

type Address = {
  number?: string
  address?: string
  postalCode?: string
  cityName?: string
}

export const addressFormatted = (itemAddress: Address) => {
  const { number, address, postalCode, cityName } = itemAddress

  if (number && address && postalCode && cityName) {
    return `${number} ${address}, ${postalCode} ${cityName}`
  }

  if (address && postalCode && cityName) {
    return `${address}, ${postalCode} ${cityName}`
  }

  if (postalCode && cityName) {
    return `${postalCode} ${cityName}`
  }

  return 'Adresse non renseignée'
}
