import MandatePersonCard, {
  MandatePersonCardProps,
  MandatePersonCardType,
} from '~/components/Procurations/Components/MandantTab/Components/MandatePersonCard/MandatePersonCard'
import { fireEvent, render } from '@testing-library/react'
import { faker } from '@faker-js/faker'
import { beforeAll, expect, vitest } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ProcurationStatusEnum } from '~/api/Procuration/procuration.model'

describe('Mandate person card', () => {
  beforeAll(() => {
    vitest.mock('react-router-dom')
  })

  const payload: MandatePersonCardProps = {
    type: MandatePersonCardType.MATCH_MANDANT,
    avatarUrl: faker.image.url(),
    extraInfos: [],
    firstName: faker.person.firstName(),
    status: ProcurationStatusEnum.PENDING,
    id: faker.string.uuid(),
    lastName: faker.person.lastName(),
    location: faker.person.jobArea(),
    onExpend: vitest.fn(),
    onNarrow: vitest.fn(),
    history: null,
    peopleInSameVotePlace: faker.number.int({
      min: 0,
      max: 10,
    }),
    tags: [],
    votePlace: faker.person.jobArea(),
    district: null,
  }

  it('Should expand card', async () => {
    const queryClient = new QueryClient()
    const tree = render(
      <QueryClientProvider client={queryClient}>
        <MandatePersonCard {...payload} expended={false} />
      </QueryClientProvider>
    )

    const moreButton = await tree.findByTestId('moreButton')

    expect(moreButton).toBeTruthy()

    fireEvent.click(moreButton)
    expect(payload.onExpend).toHaveBeenCalledWith(payload.id)
  })

  it('Should narrow card', async () => {
    const queryClient = new QueryClient()
    const tree = render(
      <QueryClientProvider client={queryClient}>
        <MandatePersonCard {...payload} expended={true} />
      </QueryClientProvider>
    )

    expect(tree.queryByTestId('moreButton')).toBeFalsy()

    const lessButton = await tree.findByTestId('lessButton')

    expect(lessButton).toBeTruthy()
    fireEvent.click(lessButton)

    expect(payload.onNarrow).toHaveBeenCalledWith(payload.id)
  })
})
