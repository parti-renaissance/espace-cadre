import PropTypes from 'prop-types'
import { createOvermind } from 'overmind'
import { createActionsHook, createStateHook, Provider as OvermindProvider } from 'overmind-react'

const initialState = {}

const actions = {}

const overmind = createOvermind({ state: initialState, actions }, { devtools: false })

export const useAppState = createStateHook()
export const useActions = createActionsHook()

export const AppStateProvider = ({ children }) => <OvermindProvider value={overmind}>{children}</OvermindProvider>

AppStateProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
