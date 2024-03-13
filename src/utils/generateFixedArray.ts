import { random } from 'lodash'

export default function generateFixedArray(length = 3) {
  return Array.from({ length }, () => random(false))
}
