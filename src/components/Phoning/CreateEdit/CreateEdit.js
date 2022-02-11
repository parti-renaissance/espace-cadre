import PropTypes from 'prop-types'
import { useEffect, useState, useMemo } from 'react'
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
import Stepper from 'ui/Stepper/Stepper'
import ValidateAction from 'ui/Stepper/Submit'
import GlobalSettings from './CreateEditGlobalSettings'
import CallersAndSurvey from './CreateEditCallersAndSurvey'
import Filters from './CreateEditFilters'
import { useUserScope } from '../../../redux/user/hooks'

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

const nationalScopes = ['national', 'national_communication', 'pap_national_manager', 'phoning_national_manager']

const CreateEdit = ({ campaign, onCreateResolve, onUpdateResolve, handleClose }) => {
  const [currentScope] = useUserScope()
  const initialStateWithZone = { ...initialValues.globalSettings, zone: currentScope.zones[0] }
  const isNational = useMemo(() => nationalScopes.includes(currentScope?.code), [currentScope?.code])
  const [globalSettings, setGlobalSettings] = useState(isNational ? initialValues.globalSettings : initialStateWithZone)
  const [validSteps, setValidSteps] = useState([2])
  const [callersAndSurvey, setCallersAndSurvey] = useState(initialValues.callersAndSurvey)
  const [filters, setFilters] = useState(initialValues.filters)

  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError, errorMessages } = useErrorHandler()

  const { mutate: createOrUpdatePhoningCampaign } = useMutation(createOrUpdatePhoningCampaignQuery, {
    onSuccess: () => {
      enqueueSnackbar(!campaign ? messages.createSuccess : messages.editSuccess, notifyVariants.success)
      onCreateResolve && onCreateResolve()
      onUpdateResolve && onUpdateResolve()
      handleClose()
    },
    onError: handleError,
  })

  useEffect(() => {
    if (!campaign) return
    setGlobalSettings(campaignToGlobalSettingsValues(campaign.global))
    setCallersAndSurvey(campaignToCallersAndSurveyValues({ team: campaign.team, survey: campaign.survey }))
    setFilters(campaignToFiltersValues(campaign.filters))
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
      validateStep && validateStep(updatedValues)
      return updatedValues
    })
  }

  const handleSubmit = () => {
    const values = { id: campaign?.id, ...globalSettings, ...callersAndSurvey, filters }
    createOrUpdatePhoningCampaign(values)
  }

  return (
    <Dialog
      scroll="body"
      data-cy="phoning-create-edit"
      onClose={handleClose}
      PaperComponent={Paper}
      sx={{ my: 4 }}
      open
    >
      <Grid container justifyContent="space-between" alignItems="center">
        <Title>{!campaign ? messages.create : messages.update}</Title>
        <IconButton onClick={handleClose}>
          <CloseRoundedIcon />
        </IconButton>
      </Grid>

      <Grid container>
        <Stepper orientation="vertical" validSteps={validSteps} sx={{ width: '100%', pt: 4 }}>
          <GlobalSettingsContext.Provider
            value={{
              errors: errorMessages,
              values: globalSettings,
              initialValues: campaign ? campaignToGlobalSettingsValues(globalSettings) : initialStateWithZone,
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
              initialValues: campaign
                ? campaignToCallersAndSurveyValues(callersAndSurvey)
                : initialValues.callersAndSurvey,
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
              initialValues: campaign ? campaignToFiltersValues(filters) : initialValues.filters,
              updateValues: handleChangeAndValidate(setFilters),
            }}
          >
            <Filters title={messages.steps.filters} />
          </FiltersContext.Provider>
        </Stepper>

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
  onCreateResolve: PropTypes.func,
  onUpdateResolve: PropTypes.func,
  handleClose: PropTypes.func.isRequired,
}
