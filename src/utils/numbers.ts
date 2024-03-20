const locale = 'fr-FR'

export const formatToFrenchNumberString = (input: number | bigint) =>
  new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(input)

/**
 * Convert and round for currency display
 * @param input any number
 * @param digits number of digits after comma
 */
export const formatToFrenchCurrencyString = (input: number | bigint, digits: number = 2) =>
  new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: digits }).format(input)
