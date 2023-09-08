import { mandates as mandateTypes } from 'shared/constants'

export const parseMandates = (mandates, declaredMandates) => {
  if (Array.isArray(mandates) && mandates.length) {
    return mandates.map(mandate => {
      const [type, zone] = mandate.split('|')

      return {
        label: mandateTypes[type] ?? type,
        help: zone,
        badgeOptions: {
          color: 'colors.green.800',
          bgcolor: 'colors.green.300',
          sx: { border: 2 },
        },
      }
    })
  }

  if (Array.isArray(declaredMandates) && declaredMandates.length) {
    return declaredMandates.map(mandate => ({
      label: mandateTypes[mandate] ?? mandate,
      badgeOptions: { color: 'colors.green.800', bgcolor: '#fff', sx: { border: 2 } },
    }))
  }

  return []
}
