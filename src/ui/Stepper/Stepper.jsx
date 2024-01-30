import PropTypes from 'prop-types'
import React, { useState } from 'react'
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
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

import { shouldForwardProps } from '~/components/shared/shouldForwardProps'

const StepConnector = styled(MuiStepConnector)({
  '& .MuiStepConnector-line': {
    height: '32px',
  },
})

const StepTitleButton = styled(
  MuiStepButton,
  shouldForwardProps
)(({ theme }) => ({
  cursor: 'inherit',
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

const messages = {
  show: 'Afficher',
  hide: 'Masquer',
}

const Stepper = ({ children, ...props }) => (
  <MuiStepper connector={<StepConnector />} {...props}>
    {React.Children.map(children, (step, index) => {
      const isStepExpandable = step.props.children.props.isStepExpandable
      const [isStepExpanded, setIsStepExpanded] = useState(step.props.children.props.expanded)
      return (
        <Step key={index} expanded={isStepExpanded}>
          <Grid container direction="column">
            <Grid container>
              <Grid item>
                <StepTitleButton>{step.props.children.props.title}</StepTitleButton>
              </Grid>
              {isStepExpandable && (
                <Grid item>
                  <Button
                    variant="text"
                    startIcon={isStepExpanded ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    onClick={() => {
                      setIsStepExpanded(!isStepExpanded)
                    }}
                    sx={{ ml: 3, mt: 0.5 }}
                  >
                    {isStepExpanded ? messages.hide : messages.show}
                  </Button>
                </Grid>
              )}
            </Grid>
            <StepContent TransitionProps={{ unmountOnExit: false }}>
              <Grid item>{React.cloneElement(step, step.props)}</Grid>
            </StepContent>
          </Grid>
        </Step>
      )
    })}
  </MuiStepper>
)

Stepper.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Stepper
