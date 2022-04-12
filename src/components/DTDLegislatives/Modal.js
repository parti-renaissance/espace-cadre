/* eslint-disable no-console */
import { useState, forwardRef } from 'react'
import PropTypes from 'prop-types'
import { Grid, Container, Dialog, Button, Slide } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { ArrowBack as ArrowBackIcon, Close as CloseIcon } from '@mui/icons-material/'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation } from 'react-query'

import './styles.css'
import { Title } from './styles'
import RenderStep from './Modal/RenderStep'
import ActionButton from './Modal/ActionButton'
import { useErrorHandler } from 'components/shared/error/hooks'

import { createDTDLocalCampaign } from 'api/DTD'
import { DTDCampaignCreateEdit } from 'domain/DTD/campaign-create-edit'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const SignupSchema = Yup.object().shape({
  title: Yup.string().min(1, 'Minimum 1 caractère').max(120, 'Maximum 120 caractères').required('Titre obligatoire'),
  goal: Yup.number().min(1, 'Minimum 1 caractère').required('Objectif individuel obligatoire'),
  startDate: Yup.string().required('Date de début obligatoire'),
  endDate: Yup.string().required('Date de fin obligatoire'),
  brief: Yup.string().required('Brief obligatoire'),
  survey: Yup.string().required('Questionnaire obligatoire'),
})

const formData = {
  title: '',
  goal: '',
  startDate: null,
  endDate: null,
  brief: '',
  survey: '',
  votePlaces: [],
}

const messages = {
  title: 'Nouvelle campagne de porte à porte',
  backButton: 'retour',
}

const Modal = ({ open, handleClose }) => {
  const [step, setStep] = useState(1)
  const [campaignId, setCampaignId] = useState()
  const { handleError } = useErrorHandler()
  const shouldDisplayRegister = step === 1

  const formik = useFormik({
    initialValues: formData,
    validationSchema: SignupSchema,
    onSubmit: values => {
      createCampaign(
        new DTDCampaignCreateEdit(
          values.title,
          values.goal,
          values.startDate,
          values.endDate,
          values.survey,
          values.brief,
          values.votePlaces
        )
      )
    },
  })

  const next = () => {
    setStep(s => s + 1)
  }

  const back = () => {
    setStep(s => s - 1)
  }

  const isStepOneValid =
    !formik.errors.title &&
    !formik.errors.goal &&
    !formik.errors.startDate &&
    !formik.errors.endDate &&
    !formik.errors.brief &&
    !formik.errors.survey &&
    formik.touched.title &&
    formik.touched.goal

  const { mutateAsync: createCampaign } = useMutation(createDTDLocalCampaign, {
    onSuccess: campaignId => {
      setCampaignId(campaignId)
      next()
    },
    onError: handleError,
  })

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
              handleSubmit={formik.handleSubmit}
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
          campaignId={campaignId}
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
