import MandatePersonCard, {
  MandatePersonCardProps,
} from '~/components/Mandates/Components/MandantTab/Components/MandatePersonCard'
import { fireEvent, render } from '@testing-library/react'
import { faker } from '@faker-js/faker'
import { expect, vitest } from 'vitest'

describe('Mandate person card', () => {
  const payload: MandatePersonCardProps = {
    avatarUrl: faker.image.url(),
    extraInfos: [],
    firstName: faker.person.firstName(),
    id: faker.string.uuid(),
    lastName: faker.person.lastName(),
    location: faker.person.jobArea(),
    onExpend: vitest.fn(),
    onNarrow: vitest.fn(),
    peopleInSameVotePlace: faker.number.int({
      min: 0,
      max: 10,
    }),
    tags: [],
    votePlace: faker.person.jobArea(),
  }

  it('Should expand card', async () => {
    const tree = render(<MandatePersonCard {...payload} expended={false} />)

    const moreButton = await tree.findByTestId('moreButton')

    expect(moreButton).toBeTruthy()

    fireEvent.click(moreButton)
    expect(payload.onExpend).toHaveBeenCalledWith(payload.id)
  })

  it('Should narrow card', async () => {
    const tree = render(<MandatePersonCard {...payload} expended={true} />)

    expect(tree.queryByTestId('moreButton')).toBeFalsy()

    const lessButton = await tree.findByTestId('lessButton')

    expect(lessButton).toBeTruthy()
    fireEvent.click(lessButton)

    expect(payload.onNarrow).toHaveBeenCalledWith(payload.id)
  })
})
