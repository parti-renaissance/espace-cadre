import { render } from '@testing-library/react'
import MentionsLegales from './MentionsLegales'

jest.mock('@mui/styles', () => ({
  makeStyles: () => () => ({
    mentionsLegales: 'mentionsLegales',
    version: 'version',
    list: 'list',
    signature: 'signature',
  }),
}))
describe('MentionsLegales', () => {
  it('renders', () => {
    const { container } = render(<MentionsLegales />)

    expect(container).toMatchSnapshot()
  })
})
