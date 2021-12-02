export const pluralize = (count, word, suffix = 's') => `${word}${count > 1 ? suffix : ''}`
