import { render } from '@testing-library/react'
import CtaButton from 'ui/Card/CtaButton/CtaButton'

jest.mock('@mui/system', () => ({
  styled: c => () => c,
}))
jest.mock('@mui/material', () => ({
  Button: ({ children }) => <div className="mui-button-mock">{children}</div>,
}))
describe('CtaButton', () => {
  it('displays a CtaButton', () => {
    const { container } = render(
      <CtaButton color="color" hovercolor="hovercolor">
        foo
      </CtaButton>
    )
    expect(container).toMatchSnapshot()
  })
})
