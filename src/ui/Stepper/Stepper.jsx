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
  '& .MuiStepIcon-root.Mui-active, & .MuiStepIcon-root': {
    color: theme.palette.main,
  },
}))

const Stepper = ({ validSteps = [], children, errors, ...props }) => (
  <MuiStepper connector={<StepConnector />} {...props}>
    {React.Children.map(children, (step, index) => (
      <Step key={index} expanded>
        <Grid container direction="column">
          <Grid item>
            <StepTitleButton disabled={activeStep <= index} onClick={handleRestartFromStep(index)}>
              {step.props.children.props.title}
            </StepTitleButton>
          </Grid>

          <StepContent TransitionProps={{ unmountOnExit: false }}>
            <Grid item>{React.cloneElement(step, step.props)}</Grid>
          </StepContent>
        </Grid>
      </Step>
    ))}
  </MuiStepper>
)

Stepper.propTypes = {
  validSteps: PropTypes.arrayOf(PropTypes.number).isRequired,
  children: PropTypes.node.isRequired,
  errors: PropTypes.bool,
}

export default Stepper
