import PropTypes from 'prop-types'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { styled } from '@mui/system'
import { Button, Divider as MuiDivider, Grid, IconButton, InputAdornment, Typography } from '@mui/material'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'

import { SurveyDetailQuestion as DomainSurveyDetailQuestion } from 'domain/surveys'
import { fields } from '../shared/constants'
import { simpleField } from '../../shared/constants'
import { Input, Label } from '../shared/components/styled'
import { FormError } from 'components/shared/error/components'
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

const initialValues = [{ type: simpleField, content: '', choices: [] }]

const Questions = ({ formValues, updateFormField, errors = [] }) => {
  const [allQuestions, setAllQuestions] = useState(initialValues)

  useEffect(() => {
    setAllQuestions(formValues)
  }, [formValues])

  const updateQuestionField = useCallback(
    (id, key, value) => {
      const questions = [...allQuestions]
      const questionIndex = questions.findIndex((_, index) => index === id)
      // TODO : ici plutot que de muter questions ca serait ptete plus propre de creer
      // une nouvelle liste avec filter sans la question avec l index 'questionIndex'
      // et de rajouter un nouvel objet a cette liste
      // mais je suis pas sur de bien comprendre le systeme d index
      questions[questionIndex] = { ...questions[questionIndex], [key]: value }
      return questions
    },
    [allQuestions]
  )

  const updateQuestionMultipleFields = useCallback(
    fields => {
      let questions = allQuestions
      fields.forEach(({ id, key, value }) => {
        const questionIndex = questions.findIndex((_, index) => index === id)
        questions[questionIndex][key] = value
      })
      return questions
    },
    [allQuestions]
  )

  const handleFieldChange = (questionIndex, fieldName, value) => {
    const questions = updateQuestionField(questionIndex, fieldName, value)
    updateFormField(fields.questions, questions)
  }

  const handleQuestionTypeChange = questionIndex => event => {
    const type = event.target.value
    const questions = updateQuestionMultipleFields([
      { id: questionIndex, key: fields.type, value: type },
      { id: questionIndex, key: fields.choices, value: type !== simpleField ? ['', '', ''] : [] },
    ])
    updateFormField(fields.questions, questions)
  }

  const handleQuestionAdd = () => {
    const questions = allQuestions.concat(initialValues)
    updateFormField(fields.questions, questions)
  }

  const handleQuestionDelete = questionIndex => () => {
    const questions = allQuestions.filter((_, index) => index !== questionIndex)
    updateFormField(fields.questions, questions)
  }

  return (
    <>
      <Title sx={{ pt: 4, color: 'gray800' }}>{messages.title}</Title>

      {allQuestions.map((question, questionIndex) => (
        <Fragment key={questionIndex}>
          <Grid container sx={{ pt: 3, pb: 1 }}>
            <Label>{messages.question.label}</Label>
          </Grid>

          <Input
            name={fields.content}
            placeholder={messages.question.placeholder}
            value={question.content}
            onChange={event => handleFieldChange(questionIndex, fields.content, event.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleQuestionDelete(questionIndex)} sx={{ color: 'form.label.color' }}>
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
              <QuestionTypes selectedType={question.type} handleChange={handleQuestionTypeChange(questionIndex)} />
              {question.type !== simpleField && (
                <Choices
                  formValues={question.choices || []}
                  updateFormField={(field, value) => handleFieldChange(questionIndex, field, value)}
                />
              )}
            </Grid>
          </Grid>
        </Fragment>
      ))}

      <Grid container>
        <AddQuestionButton variant="outlined" startIcon={<AddRoundedIcon />} onClick={handleQuestionAdd} sx={{ mt: 3 }}>
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
