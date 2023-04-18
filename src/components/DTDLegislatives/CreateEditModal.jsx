import { useState, forwardRef } from 'react'
import PropTypes from 'prop-types'
import { Grid, Container, Dialog, Button, Slide } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { ArrowBack as ArrowBackIcon, Close as CloseIcon } from '@mui/icons-material/'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation } from '@tanstack/react-query'
import { useParams } from 'react-router'

import './styles.css'
import { Title } from './styles'
import RenderStep from './Modal/RenderStep'
import ActionButton from './Modal/ActionButton'
import { useErrorHandler } from 'components/shared/error/hooks'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { notifyVariants } from 'components/shared/notification/constants'
import Map from './Map'

import { createDTDLocalCampaign, updateDTDLocalCampaign } from 'api/DTD'
import MapContext from 'providers/context'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const SignupSchema = Yup.object().shape({
  title: Yup.string().min(1, 'Minimum 1 caractère').max(120, 'Maximum 120 caractères').required('Titre obligatoire'),
  goal: Yup.number()
    .typeError('La valeur doit être un nombre')
    .min(1, 'Minimum 1 caractère')
    .required('Objectif individuel obligatoire'),
  startDate: Yup.string().required('Date de début obligatoire'),
  endDate: Yup.string().required('Date de fin obligatoire'),
  brief: Yup.string().required('Brief obligatoire'),
  survey: Yup.string().required('Questionnaire obligatoire'),
})

const messages = {
  creationTitle: 'Nouvelle campagne de porte à porte',
  editionTitle: 'Modifier la campagne de porte à porte',
  backButton: 'retour',
  createSuccess: 'Campagne créée avec succès',
  editSuccess: 'La campagne a bien été modifiée',
}

const CreateEditModal = ({ open, handleClose, campaign, onCreateResolve, onUpdateResolve }) => {
  const [step, setStep] = useState(1)
  const shouldDisplayRegister = step === 1
  const { campaignId } = useParams()
  const [creationModeId, setCreationModeId] = useState()
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError, errorMessages, resetErrorMessages } = useErrorHandler()
  const [pollingStationSelection, setPollingStationSelection] = useState([])
  const value = { pollingStationSelection, setPollingStationSelection }

  const { mutateAsync: createOrUpdateCampaign, isLoading: isCampaignLoading } = useMutation(
    !campaignId && !creationModeId ? createDTDLocalCampaign : updateDTDLocalCampaign,
    {
      onSuccess: newUuid => {
        newUuid && setCreationModeId(newUuid)
        enqueueSnackbar(
          !campaignId && !creationModeId ? messages.createSuccess : messages.editSuccess,
          notifyVariants.success
        )
        onCreateResolve && onCreateResolve()
        onUpdateResolve && onUpdateResolve()
        resetErrorMessages()
        step === 1 ? next() : handleClose()
      },
      onError: handleError,
    }
  )

  const formik = useFormik({
    initialValues: {
      title: campaign?.title,
      goal: campaign?.goal,
      startDate: campaign?.startDate,
      endDate: campaign?.endDate,
      brief: campaign?.brief,
      survey: campaign?.survey,
      votePlaces: campaign?.votePlaces,
      isPublished: true,
    },
    validationSchema: SignupSchema,
    enableReinitialize: true,
    onSubmit: async values => {
      await createOrUpdateCampaign(
        campaign
          .withId(campaignId || creationModeId)
          .withTitle(values.title)
          .withGoal(values.goal)
          .withStartDate(values.startDate)
          .withEndDate(values.endDate)
          .withSurvey(values.survey)
          .withBrief(values.brief)
          .withVotePlaces(values.votePlaces)
          .withIsPublished(values.isPublished)
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
    !formik.errors.survey

  return (
    <MapContext.Provider value={value}>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <Container maxWidth="xl">
          <Grid container sx={{ py: 4, pl: 2 }}>
            <Grid item xs={12} md={9}>
              {!shouldDisplayRegister && (
                <Button startIcon={<ArrowBackIcon />} onClick={back} size="large" sx={{ color: 'main', mr: 4 }}>
                  {messages.backButton}
                </Button>
              )}
              <Title>{!campaignId && !creationModeId ? messages.creationTitle : messages.editionTitle}</Title>
            </Grid>
            <Grid
              item
              xs={12}
              md={3}
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
              className="space-x-3"
            >
              <ActionButton
                shouldDisplayRegister={shouldDisplayRegister}
                isStepOneValid={isStepOneValid}
                handleSubmit={formik.handleSubmit}
                isCampaignLoading={isCampaignLoading}
                isInCreationMode={!campaignId && !creationModeId}
              />
              <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Grid container sx={{ borderRadius: '12px', background: 'whiteCorner', pb: 1 }} className="main">
            <Grid item xs={12} md={6}>
              <RenderStep
                formik={formik}
                step={step}
                values={formik.values}
                formikErrors={formik.errors}
                errorMessages={errorMessages}
                touched={formik.touched}
                handleBlur={formik.handleBlur}
                handleChange={formik.handleChange}
                campaignId={campaignId || creationModeId}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ height: '750px' }}>
              <Map currentStep={step} />
            </Grid>
          </Grid>
        </Container>
      </Dialog>
    </MapContext.Provider>
  )
}

export default CreateEditModal

CreateEditModal.propTypes = {
  campaign: PropTypes.object,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  onCreateResolve: PropTypes.func,
  onUpdateResolve: PropTypes.func,
}
