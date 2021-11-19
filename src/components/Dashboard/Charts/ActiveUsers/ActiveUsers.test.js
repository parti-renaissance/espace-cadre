import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import ActiveUsers from './ActiveUsers'

jest.mock('@mui/styles', () => ({
  makeStyles: () => () => ({ container: 'container' }),
}))
describe('ActiveUsers graph', () => {
  it('renders without crashing', () => {
    render(
      <Provider
        store={configureStore()({
          auth: {},
          dashboard: {
            jemengage_users: null,
          },
        })}
      >
        <ActiveUsers />
      </Provider>
    )
  })
})
