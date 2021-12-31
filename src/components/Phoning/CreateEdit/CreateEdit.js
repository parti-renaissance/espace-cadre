import PropTypes from 'prop-types'
import { useMutation } from 'react-query'
import { Formik } from 'formik'
import { styled } from '@mui/system'
import { Grid, Typography, Dialog, IconButton, Paper as MuiPaper } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

import { useErrorHandler } from 'components/shared/error/hooks'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { notifyVariants } from 'components/shared/notification/constants'
import { campaignToFormValues } from '../CampaignDetail/shared/helpers'
import { PhoningCampaign as DomainPhoningCampaign } from 'domain/phoning'
import { createPhoningCampaignQuery, updatePhoningCampaignQuery } from 'api/phoning'

import UIStepper from 'ui/Stepper/Stepper'
import ValidateAction from './ValidateAction'
import GlobalSettings from './Steps/GlobalSettings'
import CallersAndSurvey from './Steps/CallersAndSurvey'
import Filters from './Steps/Filters'
import { usePhoningCreateEditState } from '..'
import { useEffect, useMemo } from 'react'
import { useActions } from '../../../providers/state'
import { isStep1Valid, isStep2Valid, isStep3Valid } from './shared/helpers'

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
  const { validSteps } = usePhoningCreateEditState()
  const { initializeSteps } = useActions()

  useEffect(() => {
    if (!campaign) return
    initializeSteps(
      [isStep1Valid, isStep2Valid, isStep3Valid].map((isValid, index) => ({
        id: index + 1,
        isValid: isValid(index < 2 ? campaign : campaign.filters),
      }))
    )
  }, [campaign, initializeSteps])

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

  return (
    <Dialog open={isOpen} onClose={handleClose} PaperComponent={Paper} sx={{ my: 4 }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Title>{!campaign ? messages.create : messages.update}</Title>
        <IconButton onClick={handleClose}>
          <CloseRoundedIcon />
        </IconButton>
      </Grid>

      <Formik
        initialValues={campaignToFormValues(campaign)}
        onSubmit={values => {
          createOrUpdatePhoningCampaign(values)
        }}
      >
        <>
          <UIStepper orientation="vertical" validSteps={validSteps} stepsCount={3} sx={{ width: '100%', pt: 4 }}>
            <GlobalSettings title={messages.steps.globalSettings} errors={errorMessages} />
            <CallersAndSurvey title={messages.steps.callersAndSurvey} />
            <Filters title={messages.steps.filters} errors={errorMessages} />
          </UIStepper>
          <ValidateAction label={!campaign ? messages.create : messages.update} disabled={validSteps.length < 3} />
        </>
      </Formik>
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
