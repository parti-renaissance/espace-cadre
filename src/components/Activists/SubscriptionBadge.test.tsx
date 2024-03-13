import { render } from '@testing-library/react'
import { expect } from 'vitest'
import SubscriptionBadge from '~/components/Activists/SubscriptionBadge'

describe('Subscription state badge', () => {
  it('Should display a subscription telephone', async () => {
    const tree = render(<SubscriptionBadge type="phone" isSubscribed />)

    expect(await tree.findAllByTestId('phone-icon')).toBeTruthy()
    expect(await tree.findAllByTestId('badge-dot'))
  })

  it('Should display a subscription telephone', async () => {
    const tree = render(<SubscriptionBadge type="email" isSubscribed />)

    expect(await tree.findAllByTestId('mail-icon')).toBeTruthy()
    expect(await tree.findAllByTestId('badge-dot'))
  })
})
