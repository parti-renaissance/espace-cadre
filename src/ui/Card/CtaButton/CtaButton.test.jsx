import { render } from '@testing-library/react'
import { CtaButton } from 'ui/Card'

jest.mock('@mui/system', () => ({
  styled: c => () => c,
}))
jest.mock('@mui/icons-material', () => {
  const icons = {
    __esModule: true,
  }

  const handler = {
    get: function (_, prop) {
      return () => <div className={`mock_${prop}Icon`} />
    },
  }

  return new Proxy(icons, handler)
})
jest.mock('@mui/material', () => ({
  Button: ({ children, color }) => (
    <div className="mui-button-mock" data-color={color}>
      {children}
    </div>
  ),
}))
describe('CtaButton', () => {
  it('displays a CtaButton', () => {
    const { container } = render(<CtaButton color="color">foo</CtaButton>)
    expect(container).toMatchSnapshot()
  })
})
