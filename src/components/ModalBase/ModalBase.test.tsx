import ModalBase from '~/components/ModalBase/ModalBase'
import { render } from '@testing-library/react'
import { faker } from '@faker-js/faker'
import { expect } from 'vitest'

describe('ModalBase', () => {
  const payload = faker.lorem.sentence()

  it('Should render ModalBase component', () => {
    const component = render(
      <ModalBase>
        <p>{payload}</p>
      </ModalBase>
    )

    expect(component.queryByText(payload))
  })
})
