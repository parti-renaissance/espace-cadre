import { mandates as mandateTypes } from 'shared/constants'

export const parseMandates = (mandates, declaredMandates) => {
  if (Array.isArray(mandates) && mandates.length) {
    return mandates.map(mandate => {
      const [type, zone] = mandate.split('|')

      return {
        label: mandateTypes[type] ?? type,
        help: zone,
        badgeOptions: {
          color: '#fff',
          bgcolor: '#208e73',
          sx: { border: 1 },
        },
      }
    })
  }

  if (Array.isArray(declaredMandates) && declaredMandates.length) {
    return declaredMandates.map(mandate => ({
      label: mandateTypes[mandate] ?? mandate,
      badgeOptions: { color: '#208e73', bgcolor: '#fff', sx: { border: 1 } },
    }))
  }

  return []
}
