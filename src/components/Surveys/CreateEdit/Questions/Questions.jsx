import PropTypes from 'prop-types'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { styled } from '@mui/system'
import { Button, Divider as MuiDivider, Grid, IconButton, InputAdornment, Typography } from '@mui/material'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { v4 as uuid } from 'uuid'

import { SurveyDetailQuestion as DomainSurveyDetailQuestion } from '~/domain/surveys'
import { fields } from '../shared/constants'
import { simpleField } from '../../shared/constants'
import UIInput from '~/ui/Input/Input'
import UIInputLabel from '~/ui/InputLabel/InputLabel'
import { FormError } from '~/components/shared/error/components'
import QuestionTypes from './QuestionTypes'
import Choices from './Choices'

const Title = styled(Typography)`
  font-size: 20px;
  font-weight: 400;
  line-height: 20px;
`

const ActionLabel = styled(Typography)`
  font-size: 15px;
  font-weight: 500;
  line-height: 26px;
  letter-spacing: 0.46px;
`

const Divider = styled(MuiDivider)(
  ({ theme }) => `
  flex: 0;
  margin-left: 8.5px;
  margin-right: 22.5px;
  border-width: 1px;
  background-color: ${theme.palette.form.label.color};
`
)

const AddQuestionButton = styled(props => <Button variant="outlined" {...props} />)(({ theme }) => ({
  borderColor: theme.palette.button.color,
  color: theme.palette.button.color,
  padding: theme.spacing(1, 2.75),
  '&:hover': {
    borderColor: theme.palette.button.color,
    color: theme.palette.button.color,
  },
}))

const messages = {
  title: 'Vos questions',
  question: {
    label: 'Question',
    validationRule: '(70 caractères)',
    placeholder: 'Ecrivez votre question',
    add: 'Ajouter une question',
  },
}

const initialQuestions = [{ type: simpleField, content: '', choices: [] }]
const initialChoices = [{ content: '' }, { content: '' }, { content: '' }]
const addMissingId = element => (element.id ? element : { ...element, id: uuid() })

const Questions = ({ formValues, updateFormField, errors = [] }) => {
  const [allQuestions, setAllQuestions] = useState([])

  useEffect(() => {
    const questions = formValues.length > 0 ? formValues : initialQuestions
    setAllQuestions(questions.map(addMissingId))
  }, [formValues])

  const updateQuestionFields = useCallback(
    fields => {
      let questions = [].concat(allQuestions)
      fields.forEach(({ questionId, fieldName, value }) => {
        const index = questions.findIndex(({ id }) => id === questionId)
        questions[index] = { ...questions[index], [fieldName]: value }
      })
      return questions
    },
    [allQuestions]
  )

  const handleFieldChange = (questionId, fieldName, value) => {
    const questions = updateQuestionFields([{ questionId, fieldName, value }])
    updateFormField(fields.questions, questions)
  }

  const handleQuestionTypeChange = questionId => event => {
    const type = event.target.value
    const questions = updateQuestionFields([
      { questionId, fieldName: fields.type, value: type },
      { questionId, fieldName: fields.choices, value: type !== simpleField ? initialChoices.map(addMissingId) : [] },
    ])
    updateFormField(fields.questions, questions)
  }

  const handleQuestionAdd = () => {
    const questions = [].concat(allQuestions).concat(initialQuestions)
    updateFormField(fields.questions, questions)
  }

  const handleQuestionDelete = questionId => () => {
    const questions = [].concat(allQuestions).filter(({ id }) => id !== questionId)
    updateFormField(fields.questions, questions)
  }

  return (
    <>
      <Title data-cy="surveys-create-edit-questions-label" sx={{ pt: 4, color: 'gray800' }}>
        {messages.title}
      </Title>

      {allQuestions.map(question => (
        <Fragment key={question.id}>
          <Grid container sx={{ pt: 3, pb: 1 }}>
            <UIInputLabel data-cy="surveys-create-edit-question-content-label">{messages.question.label}</UIInputLabel>
          </Grid>

          <UIInput
            data-cy="surveys-create-edit-question-content-input"
            name={fields.content}
            placeholder={messages.question.placeholder}
            value={question.content}
            onChange={event => handleFieldChange(question.id, fields.content, event.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    data-cy="surveys-create-edit-question-delete-button"
                    onClick={handleQuestionDelete(question.id)}
                    sx={{ color: 'form.label.color' }}
                    disableRipple
                  >
                    <DeleteRoundedIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormError errors={errors} field="content" />

          <Grid container sx={{ pt: 2 }}>
            <Divider orientation="vertical" flexItem />
            <Grid item alignItems="center" sx={{ flex: 1, py: 2 }}>
              <QuestionTypes selectedType={question.type} handleChange={handleQuestionTypeChange(question.id)} />
              {question.type !== simpleField && (
                <Choices
                  formValues={question.choices || []}
                  updateFormField={(field, value) => handleFieldChange(question.id, field, value)}
                />
              )}
            </Grid>
          </Grid>
        </Fragment>
      ))}

      <Grid container>
        <AddQuestionButton
          data-cy="surveys-create-edit-question-add-button"
          variant="outlined"
          startIcon={<AddRoundedIcon />}
          onClick={handleQuestionAdd}
          sx={{ mt: 3 }}
        >
          <ActionLabel>{messages.question.add}</ActionLabel>
        </AddQuestionButton>
      </Grid>
    </>
  )
}

Questions.propTypes = {
  formValues: PropTypes.arrayOf(PropTypes.shape(DomainSurveyDetailQuestion.propTypes)).isRequired,
  updateFormField: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string,
      message: PropTypes.string,
    })
  ),
  readOnly: PropTypes.bool.isRequired,
}

export default Questions
