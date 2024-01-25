import { render } from '@testing-library/react'
import { CtaButton } from 'ui/Card'

vi.mock('@mui/system', () => ({
  styled: c => () => c,
}))
vi.mock('@mui/icons-material', () => {
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
vi.mock('@mui/material', async importOriginal => {
  const actual = await importOriginal()
  return {
    ...actual,
    Button: ({ children, color }) => (
      <div className="mui-button-mock" data-color={color}>
        {children}
      </div>
    ),
    // your mocked methods
  }
})
describe('CtaButton', () => {
  it('displays a CtaButton', () => {
    const { container } = render(<CtaButton color="color">foo</CtaButton>)
    expect(container).toMatchSnapshot()
  })
})
