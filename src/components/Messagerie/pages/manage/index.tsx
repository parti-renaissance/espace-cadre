import { Button, Container, Grid, Stack } from '@mui/material'
import { Outlet, useLocation } from 'react-router'
import * as React from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import { paths } from '~/components/Messagerie/shared/paths'
import useDrawerStore from '~/stores/drawerStore'
import Iconify from '~/mui/iconify'
import { useNavigate } from 'react-router-dom'

const getPath = (location: string) => {
  const [, , action, type, id, step] = location.split('/')
  if (action === 'creer') {
    return {
      action,
      step: id,
      type,
      id: undefined,
    }
  } else if (action === 'modifier') {
    return {
      action,
      id,
      type,
      step,
    }
  }
  throw new Error('Invalid path')
}

export function StepperMessagerie() {
  const location = useLocation()
  const { id, step, action, type } = getPath(location.pathname)
  const [activeStep, setActiveStep] = React.useState(0)
  const routePath = `/messagerie/${action}/${type}`
  const steps = [
    { name: 'Éditeur', route: `${routePath}/${id ?? ''}` },
    { name: 'Aperçu', route: `${routePath}/${id}/${paths.preview}` },
    { name: 'Destinataires', route: `${routePath}/${id}/${paths.filter}` },
  ]
  const navigate = useNavigate()
  const getBackPath = () => steps[activeStep - 1]?.route ?? '../'

  React.useEffect(() => {
    if (step === undefined) {
      setActiveStep(0)
    }
    if (step === undefined && (type === paths.createNewsletter || type === paths.createActuality)) {
      setActiveStep(steps.length - 3)
    }

    if (step === paths.preview) {
      setActiveStep(steps.length - 2)
    }

    if (step === paths.filter) {
      setActiveStep(steps.length - 1)
    }
  }, [step, type, steps.length])

  return (
    <Grid container spacing={4}>
      <Grid item xs={4}>
        <Button startIcon={<Iconify icon="eva:arrow-ios-back-fill" />} onClick={() => navigate(getBackPath())}>
          Retour
        </Button>
      </Grid>
      <Grid item xs={8}>
        <Box sx={{ width: '100%' }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map(({ name, route }) => (
              <Step key={name}>
                <StepLabel onClick={() => (id ? navigate(route) : null)}>{name}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Grid>
    </Grid>
  )
}

export default function ManageIndex() {
  const { setHideNav, fullscreen } = useDrawerStore()

  React.useEffect(() => {
    setHideNav(true)
    return () => {
      setHideNav(false)
    }
  }, [setHideNav])

  return fullscreen ? (
    <Outlet />
  ) : (
    <Container maxWidth="xl">
      <Stack spacing={8}>
        <StepperMessagerie />
        <Outlet />
      </Stack>
    </Container>
  )
}
