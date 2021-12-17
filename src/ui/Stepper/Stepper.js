import PropTypes from 'prop-types'
import React, { useCallback, useState } from 'react'
import { styled } from '@mui/system'
import {
  Button,
  Stepper,
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

const StepButton = styled(
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
    color: theme.palette.phoning.color,
  },
}))

const PrevStepButton = styled(props => <Button variant="contained" {...props} />)(({ theme }) => ({
  backgroundColor: theme.palette.phoning.button.background.prev,
  color: theme.palette.phoning.button.color.prev,
  borderRadius: '8.35px',
  '&:hover': {
    backgroundColor: theme.palette.phoning.button.background.prev,
    color: theme.palette.phoning.button.color.prev,
  },
  '&:disabled': {
    backgroundColor: theme.palette.phoning.button.background.disabled,
    color: theme.palette.phoning.button.color.disabled,
  },
}))

const NextStepButton = styled(props => <Button variant="contained" {...props} />)(({ theme }) => ({
  backgroundColor: theme.palette.phoning.button.background.next,
  color: theme.palette.phoning.button.color.next,
  borderRadius: '8.35px',
  '&:hover': {
    backgroundColor: theme.palette.phoning.button.background.next,
    color: theme.palette.phoning.button.color.next,
  },
}))

const messages = {
  prev: 'Précédent',
  next: 'Suivant',
  finish: 'Terminer',
}

const UIStepper = ({ children, ...props }) => {
  const [activeStep, setActiveStep] = useState(0)
  const handlePrevStep = useCallback(() => setActiveStep(prevStep => prevStep - 1), [])
  const handleNextStep = useCallback(() => setActiveStep(prevStep => prevStep + 1), [])
  const handleRestartFromStep = useCallback(
    step => () => {
      activeStep > step && setActiveStep(step)
    },
    [activeStep]
  )

  return (
    <Stepper connector={<StepConnector />} activeStep={activeStep} {...props}>
      {React.Children.map(children, (step, index) => (
        <Step key={index}>
          <Grid container direction="column">
            <Grid item>
              <StepButton disabled={activeStep === index} onClick={handleRestartFromStep(index)}>
                {step.props.title}
              </StepButton>
            </Grid>

            <StepContent TransitionProps={{ unmountOnExit: false }} transitionDuration={0}>
              <Grid item>{React.cloneElement(step, step.props)}</Grid>

              <Grid item sx={{ pt: 3 }}>
                <PrevStepButton disabled={activeStep === 0} onClick={handlePrevStep}>
                  {messages.prev}
                </PrevStepButton>
                <NextStepButton onClick={handleNextStep} sx={{ ml: 2 }}>
                  {activeStep !== children.length - 1 ? messages.next : messages.finish}
                </NextStepButton>
              </Grid>
            </StepContent>
          </Grid>
        </Step>
      ))}
    </Stepper>
  )
}

UIStepper.propTypes = {
  children: PropTypes.node.isRequired,
}

export default UIStepper
