export default (count, word, suffix = 's') => `${word}${count > 1 ? suffix : ''}`
