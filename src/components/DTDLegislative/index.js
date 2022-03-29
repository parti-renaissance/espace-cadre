/* eslint-disable no-console */
import { Grid, Container, Dialog, Button as MUIButton, Slide } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { ArrowBack as ArrowBackIcon, Close as CloseIcon } from '@mui/icons-material/'

import { useFormik } from 'formik'
import * as Yup from 'yup'

import Button from 'ui/Button'
import Register from './Register'
import Map from './Map'
import './styles.css'
import { useState, forwardRef } from 'react'
import PollingStationSelect from './PollingStationSelect'
import { Title } from './styles'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const SignupSchema = Yup.object().shape({
  title: Yup.string().required('title is required'),
  objective: Yup.string().required('objective is required'),
  startDate: Yup.string().required('startDate is required'),
  endDate: Yup.string().required('endDate is required'),
  brief: Yup.string().required('brief is required'),
  survey: Yup.string().required('survey is required'),
  firstName: Yup.string().required('firstName is required'),
  lastName: Yup.string().required('lastName is required'),
})

const RenderStep = ({ formik, step, values, errors, touched, handleBlur, handleChange, handleSubmit, next, back }) => {
  switch (step) {
    case 1:
      return (
        <Register
          formik={formik}
          values={values}
          errors={errors}
          touched={touched}
          handleChange={handleChange}
          handleBlur={handleBlur}
          next={next}
        />
      )
    case 2:
      return <PollingStationSelect formik={formik} />
    default:
      return <Register errors={errors} touched={touched} />
  }
}

const messages = {
  title: 'Nouvelle campagne de porte à porte',
  nextButton: 'suivant',
  backButton: 'retour',
  submitButton: 'créer la campagne',
}

function App() {
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
    firstName: '',
    lastName: '',
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
    onSubmit: async values => {},
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

  const isStepTwoValid =
    !formik.errors.firstName && !formik.errors.lastName && formik.touched.firstName && formik.touched.lastName

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
          <Grid item xs={12} md={6} sx={{ px: 4 }}>
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

export default DTDLocal

RenderStep.propTypes = {
  formik: PropTypes.func,
  step: PropTypes.number,
  values: PropTypes.object,
  errors: PropTypes.object,
  touched: PropTypes.object,
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func,
}
