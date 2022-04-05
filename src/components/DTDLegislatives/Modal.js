/* eslint-disable no-console */
import { useState, forwardRef } from 'react'
import PropTypes from 'prop-types'
import { Grid, Container, Dialog, Button, Slide } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { ArrowBack as ArrowBackIcon, Close as CloseIcon } from '@mui/icons-material/'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import './styles.css'
import { Title } from './styles'
import RenderStep from './Modal/RenderStep'
import ActionButton from './Modal/ActionButton'

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
  backButton: 'retour',
}

const Modal = ({ open, handleClose }) => {
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

  return (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
      <Container maxWidth="xl">
        <Grid container sx={{ py: 4, pl: 2 }}>
          <Grid item xs={12} md={9}>
            {!shouldDisplayRegister && (
              <Button startIcon={<ArrowBackIcon />} onClick={back} size="large" sx={{ color: 'main', mr: 4 }}>
                {messages.backButton}
              </Button>
            )}
            <Title>{messages.title}</Title>
          </Grid>
          <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <ActionButton
              shouldDisplayRegister={shouldDisplayRegister}
              isStepOneValid={isStepOneValid}
              isStepTwoValid={isStepTwoValid}
              handleSubmit={handleSubmit}
              next={next}
            />
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
        <RenderStep
          formik={formik}
          step={step}
          values={formik.values}
          errors={formik.errors}
          touched={formik.touched}
          handleBlur={formik.handleBlur}
          handleChange={formik.handleChange}
        />
      </Container>
    </Dialog>
  )
}

export default Modal

Modal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
}
