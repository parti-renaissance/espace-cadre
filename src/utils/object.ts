import { snakeCase } from 'lodash'

export const objectToSnakeCase = (obj?: Record<string, any>) =>
  obj
    ? Object.keys(obj).reduce((acc, key) => {
        acc[snakeCase(key)] = obj[key]
        return acc
      }, {})
    : obj
