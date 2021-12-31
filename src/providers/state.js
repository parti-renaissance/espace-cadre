import PropTypes from 'prop-types'
import { createOvermind } from 'overmind'
import { createActionsHook, createStateHook, Provider as OvermindProvider } from 'overmind-react'

const initialState = {
  phoning: {
    createEdit: {
      validSteps: [],
      steps: [
        {
          id: 1,
          isCompleted: false,
        },
        {
          id: 2,
          isCompleted: false,
        },
        {
          id: 3,
          isCompleted: false,
        },
      ],
    },
  },
}

const computeValidSteps = steps =>
  steps.map((step, index) => (step.isCompleted ? index : null)).filter(step => typeof step === 'number')

const actions = {
  initializeSteps: ({ state }, validatedSteps) => {
    if (!Array.isArray(validatedSteps)) return state

    validatedSteps.forEach(({ id, isValid }) => {
      const stepIndex = state.phoning.createEdit.steps.findIndex(({ id: stepId }) => stepId === id)
      if (stepIndex < 0) return state
      state.phoning.createEdit.steps[stepIndex].isCompleted = !!isValid
    })

    state.phoning.createEdit.validSteps = computeValidSteps(state.phoning.createEdit.steps)
  },
  validateStep: ({ state }, { id, isValid }) => {
    const stepIndex = state.phoning.createEdit.steps.findIndex(({ id: stepId }) => stepId === id)
    if (stepIndex < 0) return state
    state.phoning.createEdit.steps[stepIndex].isCompleted = !!isValid
    state.phoning.createEdit.validSteps = computeValidSteps(state.phoning.createEdit.steps)
  },
}

const overmind = createOvermind({ state: initialState, actions }, { devtools: false })

export const useAppState = createStateHook()
export const useActions = createActionsHook()

export const AppStateProvider = ({ children }) => <OvermindProvider value={overmind}>{children}</OvermindProvider>

AppStateProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
