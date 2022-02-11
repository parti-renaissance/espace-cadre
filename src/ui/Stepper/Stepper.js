import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { styled } from '@mui/system'
import {
  Button,
  Stepper as MuiStepper,
  Step,
  StepButton as MuiStepButton,
  StepContent,
  StepConnector as MuiStepConnector,
  Grid,
} from '@mui/material'

import { shouldForwardProps } from 'components/shared/shouldForwardProps'

const StepConnector = styled(MuiStepConnector)({
  '& .MuiStepConnector-line': {
    height: '32px',
  },
})

const StepTitleButton = styled(
  MuiStepButton,
  shouldForwardProps
)(({ theme, isCurrentStep }) => ({
  cursor: !isCurrentStep ? 'pointer' : 'inherit',
  '& .MuiStepLabel-label.Mui-active, & .MuiStepLabel-label.Mui-completed, & .MuiStepLabel-label.Mui-disabled': {
    fontSize: '18px',
    fontWeight: 600,
    lineHeight: '18px',
    color: theme.palette.stepper.stepTitle.color,
  },
  '& .MuiStepIcon-root.Mui-active, & .MuiStepIcon-root.Mui-completed': {
    color: theme.palette.campaign.color,
  },
}))

const PrevStepButton = styled(props => <Button variant="contained" {...props} />)(({ theme }) => ({
  borderRadius: '8px',
  '&:not(.Mui-disabled)': {
    backgroundColor: theme.palette.campaign.button.background.prev,
    color: theme.palette.campaign.button.color.prev,
    '&:hover': {
      backgroundColor: theme.palette.campaign.button.background.prev,
      color: theme.palette.campaign.button.color.prev,
    },
  },
  '&:disabled': {
    backgroundColor: theme.palette.campaign.button.background.disabled,
    color: theme.palette.campaign.button.color.disabled,
  },
}))

const NextStepButton = styled(props => <Button variant="contained" {...props} />)(({ theme }) => ({
  borderRadius: '8px',
  '&:not(.Mui-disabled)': {
    backgroundColor: theme.palette.campaign.button.background.next,
    color: theme.palette.campaign.button.color.next,
    '&:hover': {
      backgroundColor: theme.palette.campaign.button.background.next,
      color: theme.palette.campaign.button.color.next,
    },
  },
  '&:disabled': {
    backgroundColor: theme.palette.campaign.button.background.disabled,
    color: theme.palette.campaign.button.color.disabled,
  },
}))

const messages = {
  prev: 'Précédent',
  next: 'Suivant',
  finish: 'Terminer',
}

const Stepper = ({ validSteps = [], children, resetActiveStep, ...props }) => {
  const [activeStep, setActiveStep] = useState(0)
  const handlePrevStep = useCallback(() => setActiveStep(prevStep => prevStep - 1), [])
  const handleNextStep = useCallback(() => setActiveStep(prevStep => prevStep + 1), [])
  const handleRestartFromStep = useCallback(
    step => () => {
      activeStep > step && setActiveStep(step)
    },
    [activeStep]
  )

  useEffect(() => {
    resetActiveStep(() => {
      setActiveStep(0)
    })
  }, [resetActiveStep])

  if (!activeStep && activeStep !== 0) return null

  return (
    <MuiStepper connector={<StepConnector />} activeStep={activeStep} {...props}>
      {React.Children.map(children, (step, index) => (
        <Step key={index}>
          <Grid container direction="column">
            <Grid item>
              <StepTitleButton disabled={activeStep <= index} onClick={handleRestartFromStep(index)}>
                {step.props.children.props.title}
              </StepTitleButton>
            </Grid>

            <StepContent TransitionProps={{ unmountOnExit: false }}>
              <Grid item>{React.cloneElement(step, step.props)}</Grid>

              <Grid item sx={{ pt: 3 }}>
                <PrevStepButton disabled={activeStep === 0} onClick={handlePrevStep}>
                  {messages.prev}
                </PrevStepButton>
                <NextStepButton disabled={!validSteps.includes(activeStep)} onClick={handleNextStep} sx={{ ml: 2 }}>
                  {activeStep !== children.length - 1 ? messages.next : messages.finish}
                </NextStepButton>
              </Grid>
            </StepContent>
          </Grid>
        </Step>
      ))}
    </MuiStepper>
  )
}

Stepper.propTypes = {
  validSteps: PropTypes.arrayOf(PropTypes.number).isRequired,
  resetActiveStep: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}

export default Stepper
