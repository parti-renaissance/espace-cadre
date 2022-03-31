/* eslint-disable no-console */
import { useState, forwardRef } from 'react'
import { Grid, Container, Dialog, Button as MUIButton, Slide } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { ArrowBack as ArrowBackIcon, Close as CloseIcon } from '@mui/icons-material/'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import Button from 'ui/Button'
import Map from './Map'
import './styles.css'
import { Title } from './styles'
import RenderStep from './RenderStep'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const SignupSchema = Yup.object().shape({
  title: Yup.string().min(1, 'Minimum 1 caractère').max(120, 'Maximum 120 caractères').required('Titre obligatoire'),
  objective: Yup.string()
    .min(1, 'Minimum 1 caractère')
    .max(120, 'Maximum 120 caractères')
    .required('Objectif individuel obligatoire'),
  startDate: Yup.string().required('Date de début obligatoire'),
  endDate: Yup.string().required('Date de fin obligatoire'),
  brief: Yup.string().required('Brief obligatoire'),
  survey: Yup.string().required('Questionnaire obligatoire'),
  isCheck: Yup.array().min(1, 'Minimum 1 Bureau de vote'),
})

const messages = {
  title: 'Nouvelle campagne de porte à porte',
  nextButton: 'suivant',
  backButton: 'retour',
  submitButton: 'créer la campagne',
}

const DTDLegislatives = () => {
  const [open, setOpen] = useState(true)
  const [step, setStep] = useState(1)
  const shouldDisplayRegister = step === 1

  const formData = {
    title: '',
    objective: '',
    startDate: null,
    endDate: null,
    brief: '',
    survey: '',
    isCheck: [],
  }

  const next = () => {
    setStep(s => s + 1)
  }

  const back = () => {
    setStep(s => s - 1)
  }

  const formik = useFormik({
    initialValues: formData,
    validationSchema: SignupSchema,
  })

  const isStepOneValid =
    !formik.errors.title &&
    !formik.errors.objective &&
    !formik.errors.startDate &&
    !formik.errors.endDate &&
    !formik.errors.brief &&
    !formik.errors.survey &&
    formik.touched.title &&
    formik.touched.objective

  const isStepTwoValid = !formik.errors.isCheck

  const handleSubmit = () => {
    console.log('===============Submit form=====================')
    console.log(formik.values)
    console.log('====================================')
  }

  const handleClose = () => {
    setOpen(false)
    window.open('/porte-a-porte', '_self')
  }

  const ActionButton = () => {
    if (shouldDisplayRegister) {
      return (
        <Button
          type="submit"
          onClick={next}
          rootProps={{ sx: { color: 'whiteCorner', mr: 4 } }}
          disabled={!isStepOneValid}
        >
          {messages.nextButton}
        </Button>
      )
    }
    return (
      <Button
        type="submit"
        onClick={handleSubmit}
        rootProps={{ sx: { color: 'whiteCorner', mr: 4 } }}
        disabled={!isStepTwoValid}
      >
        {messages.submitButton}
      </Button>
    )
  }

  return (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
      <Container maxWidth="xl">
        <Grid container sx={{ py: 4, pl: 2 }}>
          <Grid item xs={9}>
            {!shouldDisplayRegister && (
              <MUIButton startIcon={<ArrowBackIcon />} onClick={back} size="large" sx={{ color: 'main', mr: 4 }}>
                {messages.backButton}
              </MUIButton>
            )}
            <Title>{messages.title}</Title>
          </Grid>
          <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <ActionButton />
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Grid container sx={{ borderRadius: '12px', background: 'whiteCorner' }} className="main">
          <Grid item xs={12} md={6} sx={{ ...(step === 1 && { px: 4 }), ...(step === 2 && { px: 2 }) }}>
            <RenderStep
              formik={formik}
              step={step}
              values={formik.values}
              errors={formik.errors}
              touched={formik.touched}
              handleBlur={formik.handleBlur}
              handleChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Map />
          </Grid>
        </Grid>
      </Container>
    </Dialog>
  )
}

export default DTDLegislatives
