import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
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
import { PhoningCampaign as DomainPhoningCampaign } from 'domain/phoning'
import { createPhoningCampaignQuery, updatePhoningCampaignQuery } from 'api/phoning'
import { CallersAndSurveyContext, FiltersContext, GlobalSettingsContext, initialValues } from './shared/context'
import { validateAllSteps, toggleValidStep, isStep1Valid, isStep2Valid, isStep3Valid } from './shared/helpers'

import UIStepper from 'ui/Stepper/Stepper'
import ValidateAction from './ValidateAction'
import GlobalSettings from './Steps/GlobalSettings'
import CallersAndSurvey from './Steps/CallersAndSurvey'
import Filters from './Steps/Filters'

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

  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError, errorMessages } = useErrorHandler()

  const { mutate: createOrUpdatePhoningCampaign } = useMutation(
    !campaign ? createPhoningCampaignQuery : updatePhoningCampaignQuery,
    {
      onSuccess: () => {
        enqueueSnackbar(!campaign ? messages.createSuccess : messages.editSuccess, notifyVariants.success)
        onCreateResolve()
        handleClose()
      },
      onError: handleError,
    }
  )

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
    const id = campaign?.id ? campaign.id : {}
    const values = { id, ...globalSettings, ...callersAndSurvey, filters }
    createOrUpdatePhoningCampaign(values)
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} PaperComponent={Paper} sx={{ my: 4 }}>
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
              updateValues: handleChangeAndValidate(setGlobalSettings, handleStepValidation(0, isStep1Valid)),
            }}
          >
            <GlobalSettings title={messages.steps.globalSettings} />
          </GlobalSettingsContext.Provider>
          <CallersAndSurveyContext.Provider
            value={{
              errors: errorMessages,
              values: callersAndSurvey,
              initialValues: campaign ? campaignToCallersAndSurveyValues(campaign) : initialValues.callersAndSurvey,
              updateValues: handleChangeAndValidate(setCallersAndSurvey, handleStepValidation(1, isStep2Valid)),
            }}
          >
            <CallersAndSurvey title={messages.steps.callersAndSurvey} />
          </CallersAndSurveyContext.Provider>
          <FiltersContext.Provider
            value={{
              errors: errorMessages,
              values: filters,
              initialValues: campaign ? campaignToFiltersValues(campaign) : initialValues.filters,
              updateValues: handleChangeAndValidate(setFilters, handleStepValidation(2, isStep3Valid)),
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
  campaign: DomainPhoningCampaign.propTypes,
  isOpen: PropTypes.bool.isRequired,
  onCreateResolve: PropTypes.func,
  handleClose: PropTypes.func.isRequired,
}
