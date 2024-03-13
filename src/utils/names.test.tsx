import { fullName, getInitials, guessHumanReadableTitleBasedOnGender } from '~/utils/names'
import { faker } from '@faker-js/faker'
import { expect } from 'vitest'
import { GenderEnum } from '~/models/common.model'

describe('Name features', () => {
  const payload = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
  }

  it('Should concat names', () => {
    expect(fullName(payload)).toBe(`${payload.first_name} ${payload.last_name}`)
  })

  it('Should get initials', () => {
    expect(getInitials({ first_name: 'En', last_name: 'Marche' })).toBe('EM')
  })

  it('Should guess title', () => {
    expect(guessHumanReadableTitleBasedOnGender(GenderEnum.MALE)).toBe('Monsieur')
    expect(guessHumanReadableTitleBasedOnGender(GenderEnum.FEMALE)).toBe('Madame')
    expect(guessHumanReadableTitleBasedOnGender('other')).toBe(undefined)
  })
})
