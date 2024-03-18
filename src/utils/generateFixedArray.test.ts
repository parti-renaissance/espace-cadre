import { expect } from 'vitest'
import generateFixedArray from '~/utils/generateFixedArray'
import { faker } from '@faker-js/faker'

describe('Fixed array generation', () => {
  const gen = () => faker.number.int({ min: 1, max: 10 })

  const payload = {
    default: 3,
    one: gen(),
    two: gen(),
    three: gen(),
  }

  it('Should generate an array with a size of 3', () => {
    expect(generateFixedArray(payload.default)).toHaveLength(payload.default)
    expect(generateFixedArray(payload.one)).toHaveLength(payload.one)
    expect(generateFixedArray(payload.two)).toHaveLength(payload.two)
  })

  it('Should generate an array without parameters', () => {
    expect(generateFixedArray()).toHaveLength(3)
  })
})
