import PropTypes from 'prop-types'
import { useCallback, useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { styled } from '@mui/system'
import { Grid, Typography, IconButton } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

import { createOrUpdateSurveyQuery, formatZone } from '~/api/surveys'
import { SurveyDetail as DomainSurveyDetail } from '~/domain/surveys'
import { useCustomSnackbar } from '~/components/shared/notification/hooks'
import { useErrorHandler } from '~/components/shared/error/hooks'
import { notifyVariants } from '~/components/shared/notification/constants'
import { useUserScope } from '../../../redux/user/hooks'
import { simpleField, getScopeVisibility, visibility } from '../shared/constants'
import CreateEditTitleAndTerritory from './CreateEditTitleAndTerritory'
import CreateEditQuestions from './Questions/Questions'
import CreateEditVisibility from './CreateEditVisibility'
import CreateEditValidateAction from './CreateEditValidateAction'
import { useCurrentDeviceType } from '~/components/shared/device/hooks'
import Dialog from '~/ui/Dialog'

const Title = styled(Typography)`
  font-size: 24px;
  font-weight: 400;
  line-height: 24px;
`

const messages = {
  create: {
    title: 'Créer un questionnaire',
    success: 'Questionnaire créé avec succès',
    action: 'Créer un questionnaire',
  },
  update: {
    title: 'Modifier un questionnaire',
    success: 'Questionnaire modifié avec succès',
    action: 'Modifier le questionnaire',
  },
}

const initialValues = {
  isPublished: false,
  title: '',
  questions: [{ type: simpleField, content: '', choices: [] }],
}
const formatFormValues = (survey, zone, scopeCode) => ({
  ...(survey || initialValues),
  type: getScopeVisibility(scopeCode),
  zone: formatZone(zone),
})

const validateForm = ({ title, questions = [] }) => {
  const filteredQuestions = questions.filter(q => {
    const filteredChoices = q.choices.filter(({ content }) => content)
    const areValidChoices = q.type !== simpleField ? filteredChoices.length > 1 : true
    return !!(q.type && q.content && areValidChoices)
  })
  const areValidQuestions = filteredQuestions.length === questions.length
  return !!(title && areValidQuestions)
}

const SurveysCreateEdit = ({ survey, onCreateResolve, handleClose }) => {
  const [currentScope] = useUserScope()
  const {
    zones: [zone],
  } = currentScope
  const scopeCode = currentScope.getMainCode()
  const [formValues, setFormValues] = useState(formatFormValues(survey, zone, scopeCode))
  const isValidForm = useMemo(() => validateForm(formValues), [formValues])
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError, errorMessages } = useErrorHandler()
  const { isMobile } = useCurrentDeviceType()
  const updateFormField = useCallback((key, value) => {
    setFormValues(values => ({ ...values, [key]: value }))
  }, [])

  const { mutate: createOrUpdateSurvey, isLoading: isCreateOrUpdateLoading } = useMutation(createOrUpdateSurveyQuery, {
    onSuccess: () => {
      enqueueSnackbar(survey ? messages.update.success : messages.create.success, notifyVariants.success)
      onCreateResolve()
      handleClose()
    },
    onError: handleError,
  })

  const handleSubmit = () => {
    createOrUpdateSurvey({ id: survey?.id, ...formValues })
  }

  return (
    <Dialog data-cy="surveys-create-edit" handleClose={handleClose} open>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mt: isMobile ? 2 : null }}>
        <Title data-cy="surveys-create-edit-title">
          {!survey ? messages.create.title : messages.update.title} {getScopeVisibility(scopeCode)}
        </Title>
        <IconButton onClick={handleClose} data-cy="surveys-create-edit-action-close" sx={{ ml: 'auto' }}>
          <CloseRoundedIcon />
        </IconButton>
      </Grid>

      <Grid container sx={{ mb: isMobile ? 2 : null }}>
        <CreateEditTitleAndTerritory
          formValues={{ title: formValues.title, zone: formValues.zone }}
          updateFormField={updateFormField}
          errors={errorMessages}
          isZoneSelectable={getScopeVisibility(scopeCode) === visibility.national}
        />
        <CreateEditQuestions
          formValues={formValues.questions || []}
          updateFormField={updateFormField}
          errors={errorMessages}
          readOnly={!!survey?.isPublished}
        />
        <CreateEditVisibility formValues={{ isPublished: formValues.isPublished }} updateFormField={updateFormField} />
        <CreateEditValidateAction
          label={!survey ? messages.create.action : messages.update.action}
          handleValidate={handleSubmit}
          disabled={!isValidForm || isCreateOrUpdateLoading}
          isLoading={isCreateOrUpdateLoading}
        />
      </Grid>
    </Dialog>
  )
}

SurveysCreateEdit.propTypes = {
  survey: PropTypes.shape(DomainSurveyDetail.propTypes),
  onCreateResolve: PropTypes.func,
  handleClose: PropTypes.func.isRequired,
}

export default SurveysCreateEdit
