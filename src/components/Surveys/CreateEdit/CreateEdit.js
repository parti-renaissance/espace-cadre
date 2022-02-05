import PropTypes from 'prop-types'
import { useCallback, useMemo, useState } from 'react'
import { useMutation } from 'react-query'
import { styled } from '@mui/system'
import { Grid, Typography, Dialog, IconButton, Paper as MuiPaper } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

import { createOrUpdateSurveyQuery, formatZone } from 'api/surveys'
import { SurveyDetail as DomainSurveyDetail } from 'domain/surveys'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { useErrorHandler } from 'components/shared/error/hooks'
import { notifyVariants } from 'components/shared/notification/constants'
import { useUserScope } from '../../../redux/user/hooks'
import { simpleField, scopesVisibility, visibility } from '../shared/constants'
import CreateEditTitleAndTerritory from './CreateEditTitleAndTerritory'
import CreateEditQuestions from './Questions/Questions'
import CreateEditValidateAction from './CreateEditValidateAction'

const Title = styled(Typography)`
  font-size: 24px;
  font-weight: 400;
  line-height: 24px;
`

const Paper = styled(MuiPaper)(
  ({ theme }) => `
	padding: ${theme.spacing(4)};
	border-radius: 12px;
`
)

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
  type: visibility.local,
  isPublished: true,
  title: '',
  questions: [{ type: simpleField, content: '', choices: [] }],
}
const validateForm = ({ title, questions = [] }) => {
  const filteredQuestions = questions.filter(q => {
    const filteredChoices = q.choices.filter(c => c)
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
    code: scope,
  } = currentScope
  const [formValues, setFormValues] = useState(survey || { ...initialValues, zone: formatZone(zone) })
  const isValidForm = useMemo(() => validateForm(formValues), [formValues])
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError, errorMessages } = useErrorHandler()

  const updateFormField = useCallback((key, value) => {
    setFormValues(values => ({ ...values, [key]: value }))
  }, [])

  const { mutate: createOrUpdateSurvey } = useMutation(createOrUpdateSurveyQuery, {
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
    <Dialog scroll="body" data-cy="surveys-create-edit" onClose={handleClose} PaperComponent={Paper} open>
      <Grid container justifyContent="space-between" alignItems="center">
        <Title>
          {!survey ? messages.create.title : messages.update.title}
          &nbsp;
          {scopesVisibility[scope] === visibility.local && visibility.local}
          {scopesVisibility[scope] === visibility.national && visibility.national}
        </Title>
        <IconButton onClick={handleClose}>
          <CloseRoundedIcon />
        </IconButton>
      </Grid>

      <Grid container>
        <CreateEditTitleAndTerritory
          formValues={{ title: formValues.title, zone: formValues.zone }}
          updateFormField={updateFormField}
          errors={errorMessages}
          isZoneSelectable={scopesVisibility[scope] === visibility.national}
        />
        <CreateEditQuestions
          formValues={formValues.questions || []}
          updateFormField={updateFormField}
          errors={errorMessages}
          readOnly={!!survey?.isPublished}
        />
        <CreateEditValidateAction
          label={!survey ? messages.create.action : messages.update.action}
          handleValidate={handleSubmit}
          disabled={!isValidForm}
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
