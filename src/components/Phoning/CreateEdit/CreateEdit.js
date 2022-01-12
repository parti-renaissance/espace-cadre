import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation } from 'react-query'
import { styled } from '@mui/system'
import { Grid, Typography, Dialog, IconButton, Paper as MuiPaper } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

import { useErrorHandler } from 'components/shared/error/hooks'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { notifyVariants } from 'components/shared/notification/constants'
import {
  campaignToCallersAndSurveyValues,
  campaignToFiltersValues,
  campaignToGlobalSettingsValues,
} from '../CampaignDetail/shared/helpers'
import { PhoningCampaignCreateEdit as DomainPhoningCampaignCreateEdit } from 'domain/phoning'
import { createOrUpdatePhoningCampaignQuery } from 'api/phoning'
import { CallersAndSurveyContext, FiltersContext, GlobalSettingsContext, initialValues } from './shared/context'
import { validateAllSteps, toggleValidStep, validators } from './shared/helpers'

import UIStepper from 'ui/Stepper/Stepper'
import ValidateAction from './CreateEditValidateAction'
import GlobalSettings from './CreateEditGlobalSettings'
import CallersAndSurvey from './CreateEditCallersAndSurvey'
import Filters from './CreateEditFilters'

const Title = styled(Typography)`
  font-size: 24px;
  font-weight: 400;
  line-height: 24px;
`

const Paper = styled(MuiPaper)(
  ({ theme }) => `
	padding: ${theme.spacing(4)};
	width: 664px;
	border-radius: 12px;
`
)

const messages = {
  create: 'Créer une campagne',
  update: 'Modifier la campagne',
  createSuccess: 'Campagne créée avec succès',
  editSuccess: 'La campagne a bien été modifiée',
  steps: {
    globalSettings: 'Paramètres généraux',
    callersAndSurvey: 'Appelants et questionnaire',
    filters: 'Filtres',
  },
}

const CreateEdit = ({ campaign, isOpen, onCreateResolve, handleClose }) => {
  const [validSteps, setValidSteps] = useState([])
  const [globalSettings, setGlobalSettings] = useState(initialValues.globalSettings)
  const [callersAndSurvey, setCallersAndSurvey] = useState(initialValues.callersAndSurvey)
  const [filters, setFilters] = useState(initialValues.filters)

  const { campaignId } = useParams()
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError, errorMessages } = useErrorHandler()

  const { mutate: createOrUpdatePhoningCampaign } = useMutation(createOrUpdatePhoningCampaignQuery, {
    onSuccess: () => {
      enqueueSnackbar(!campaign ? messages.createSuccess : messages.editSuccess, notifyVariants.success)
      onCreateResolve()
      handleClose()
    },
    onError: handleError,
  })

  useEffect(() => {
    if (!campaign) return
    setGlobalSettings(campaignToGlobalSettingsValues(campaign))
    setCallersAndSurvey(campaignToCallersAndSurveyValues(campaign))
    setFilters(campaignToFiltersValues(campaign))
    setValidSteps(validateAllSteps(campaign))
  }, [campaign])

  const handleStepValidation = (stepId, validator) => values => {
    const isValidStep = validator(values)
    const validSteps = toggleValidStep(stepId, isValidStep)
    setValidSteps(validSteps)
  }

  const handleChangeAndValidate = (updateValues, validateStep) => (key, value) => {
    updateValues(values => {
      const updatedValues = { ...values, [key]: value }
      validateStep(updatedValues)
      return updatedValues
    })
  }

  const handleSubmit = () => {
    const id = campaignId ?? {}
    const values = { id, ...globalSettings, ...callersAndSurvey, filters }
    createOrUpdatePhoningCampaign(values)
  }

  return (
    <Dialog
      scroll="body"
      open={isOpen}
      onClose={handleClose}
      PaperComponent={Paper}
      sx={{ my: 4 }}
      data-cy="phoning-create-edit"
    >
      <Grid container justifyContent="space-between" alignItems="center">
        <Title>{!campaign ? messages.create : messages.update}</Title>
        <IconButton onClick={handleClose}>
          <CloseRoundedIcon />
        </IconButton>
      </Grid>

      <Grid container>
        <UIStepper orientation="vertical" validSteps={validSteps} stepsCount={3} sx={{ width: '100%', pt: 4 }}>
          <GlobalSettingsContext.Provider
            value={{
              errors: errorMessages,
              values: globalSettings,
              initialValues: campaign ? campaignToGlobalSettingsValues(campaign) : initialValues.globalSettings,
              updateValues: handleChangeAndValidate(
                setGlobalSettings,
                handleStepValidation(0, validators.globalSettings)
              ),
            }}
          >
            <GlobalSettings title={messages.steps.globalSettings} />
          </GlobalSettingsContext.Provider>
          <CallersAndSurveyContext.Provider
            value={{
              errors: errorMessages,
              values: callersAndSurvey,
              initialValues: campaign ? campaignToCallersAndSurveyValues(campaign) : initialValues.callersAndSurvey,
              updateValues: handleChangeAndValidate(
                setCallersAndSurvey,
                handleStepValidation(1, validators.callersAndSurvey)
              ),
            }}
          >
            <CallersAndSurvey title={messages.steps.callersAndSurvey} />
          </CallersAndSurveyContext.Provider>
          <FiltersContext.Provider
            value={{
              errors: errorMessages,
              values: filters,
              initialValues: campaign ? campaignToFiltersValues(campaign) : initialValues.filters,
              updateValues: handleChangeAndValidate(setFilters, handleStepValidation(2, validators.filters)),
            }}
          >
            <Filters title={messages.steps.filters} />
          </FiltersContext.Provider>
        </UIStepper>

        <ValidateAction
          label={!campaign ? messages.create : messages.update}
          handleValidate={handleSubmit}
          disabled={validSteps.length < 3}
        />
      </Grid>
    </Dialog>
  )
}

export default CreateEdit

CreateEdit.propTypes = {
  campaign: PropTypes.shape(DomainPhoningCampaignCreateEdit.propTypes),
  isOpen: PropTypes.bool.isRequired,
  onCreateResolve: PropTypes.func,
  handleClose: PropTypes.func.isRequired,
}
