import PropTypes from 'prop-types'
import { useEffect, useState, useMemo } from 'react'
import { useMutation } from '@tanstack/react-query'
import { styled } from '@mui/system'
import { Grid, Typography, IconButton } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

import { useUserScope } from '../../../redux/user/hooks'
import { useErrorHandler } from '~/components/shared/error/hooks'
import { useCustomSnackbar } from '~/components/shared/notification/hooks'
import { useCurrentDeviceType } from '~/components/shared/device/hooks'
import { notifyVariants } from '~/components/shared/notification/constants'
import {
  campaignToCallersAndSurveyValues,
  campaignToFiltersValues,
  campaignToGlobalSettingsValues,
} from '../CampaignDetail/shared/helpers'
import {
  PhoningCampaignCreateEdit as DomainPhoningCampaignCreateEdit,
  PhoningCampaignCreateEditZone as DomainPhoningCampaignCreateEditZone,
} from '~/domain/phoning'
import { createOrUpdatePhoningCampaignQuery } from '~/api/phoning'
import { CallersAndSurveyContext, FiltersContext, GlobalSettingsContext, initialValues } from './shared/context'
import { validateAllSteps, toggleValidStep, validators } from './shared/helpers'
import Stepper from '~/ui/Stepper/Stepper'
import ValidateAction from '~/ui/Stepper/Submit'
import GlobalSettings from './CreateEditGlobalSettings'
import CallersAndSurvey from './CreateEditCallersAndSurvey'
import Filters from './CreateEditFilters'
import Dialog from '~/ui/Dialog'
import { nationalScopes } from '~/shared/scopes'

const Title = styled(Typography)`
  font-size: 24px;
  font-weight: 400;
  line-height: 24px;
`

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

const formatCurrentZone = ({ uuid: id, name, code }) => new DomainPhoningCampaignCreateEditZone(id, name, code)

const CreateEdit = ({ campaign, onCreateResolve, onUpdateResolve, handleClose }) => {
  const { isMobile } = useCurrentDeviceType()
  const [currentScope] = useUserScope()
  const currentZone = formatCurrentZone(currentScope.zones[0])
  const initialStateWithZone = { ...initialValues.globalSettings, zone: currentZone }
  const isNational = useMemo(() => nationalScopes.includes(currentScope?.code), [currentScope?.code])
  const [globalSettings, setGlobalSettings] = useState(isNational ? initialValues.globalSettings : initialStateWithZone)
  const [validSteps, setValidSteps] = useState([2])
  const [callersAndSurvey, setCallersAndSurvey] = useState(initialValues.callersAndSurvey)
  const [filters, setFilters] = useState({ ...initialValues.filters, zones: [currentZone] })

  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError, errorMessages } = useErrorHandler()

  const { mutate: createOrUpdatePhoningCampaign, isLoading: isCreateOrUpdateLoading } = useMutation(
    createOrUpdatePhoningCampaignQuery,
    {
      onSuccess: () => {
        enqueueSnackbar(!campaign ? messages.createSuccess : messages.editSuccess, notifyVariants.success)
        onCreateResolve && onCreateResolve()
        onUpdateResolve && onUpdateResolve()
        handleClose()
      },
      onError: handleError,
    }
  )

  useEffect(() => {
    if (!campaign) {
      return
    }
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

  const handleFilterSelection = data => {
    if (!data.filters.certified) {
      delete data.filters.certified
    }
    if (!data.filters.committeeMember) {
      delete data.filters.committeeMember
    }
    if (!data.filters.emailSubscribed) {
      delete data.filters.emailSubscribed
    }
  }
  const handleSubmit = () => {
    const values = { id: campaign?.id, ...globalSettings, ...callersAndSurvey, filters }
    handleFilterSelection(values)
    createOrUpdatePhoningCampaign(values)
  }

  return (
    <Dialog data-cy="phoning-create-edit" handleClose={handleClose} open>
      <Grid container justifyContent={'space-between'} alignItems="center" sx={{ mt: isMobile ? 2 : null }}>
        <Title>{!campaign ? messages.create : messages.update}</Title>
        <IconButton onClick={handleClose}>
          <CloseRoundedIcon />
        </IconButton>
      </Grid>

      <Grid container sx={{ mb: isMobile ? 2 : null }}>
        <Stepper orientation="vertical" sx={{ width: '100%', pt: 4 }}>
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
            <CallersAndSurvey title={messages.steps.callersAndSurvey} expanded />
          </CallersAndSurveyContext.Provider>
          <FiltersContext.Provider
            value={{
              errors: errorMessages,
              values: filters,
              initialValues: campaign ? campaignToFiltersValues(campaign.filters) : initialValues.filters,
              updateValues: handleChangeAndValidate(setFilters),
            }}
          >
            <Filters title={messages.steps.filters} isStepExpandable expanded={false} />
          </FiltersContext.Provider>
        </Stepper>

        <ValidateAction
          label={!campaign ? messages.create : messages.update}
          handleValidate={handleSubmit}
          disabled={validSteps.length < 3 || isCreateOrUpdateLoading}
          isLoading={isCreateOrUpdateLoading}
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
