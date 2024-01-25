import { render } from '@testing-library/react'
import { Title } from 'ui/Card'

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
    Typography: ({ children }) => <div className="mui-typography-mock">{children}</div>,
    // your mocked methods
  }
})

describe('Title', () => {
  it('displays a Title', () => {
    const { container } = render(
      <Title subject="subject" author="author" dateTime={new Date(Date.UTC(2022, 2, 17, 8))}></Title>
    )
    expect(container).toMatchSnapshot()
  })
})
