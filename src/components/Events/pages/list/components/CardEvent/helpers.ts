export const dateFormatted = (address: string) =>
  new Date(address).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
  })

type Address = {
  number?: string
  route?: string
  postalCode?: string
  locality?: string
}

export const addressFormatted = (address: Address) => {
  const { number, route, postalCode, locality } = address

  if (number && route && postalCode && locality) {
    return `${number} ${route}, ${postalCode} ${locality}`
  }

  if (route && postalCode && locality) {
    return `${route}, ${postalCode} ${locality}`
  }

  if (postalCode && locality) {
    return `${postalCode} ${locality}`
  }

  return 'Adresse non renseignée'
}
