import PropTypes from 'prop-types'
import { useCallback, useEffect, useState } from 'react'
import { styled } from '@mui/system'
import { Button, Grid, IconButton, InputAdornment, Typography } from '@mui/material'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { v4 as uuid } from 'uuid'

import { SurveyDetailChoice as DomainSurveyDetailChoice } from '~/domain/surveys'
import UIInput from '~/ui/Input/Input'
import UIInputLabel from '~/ui/InputLabel/InputLabel'
import { fields } from '../shared/constants'

const ActionLabel = styled(Typography)`
  font-size: 15px;
  font-weight: 500;
  line-height: 22px;
  letter-spacing: 0.46px;
`

const AddChoiceButton = styled(props => <Button variant="outlined" {...props} />)(({ theme }) => ({
  borderColor: theme.palette.button.color,
  color: theme.palette.button.color,
  padding: theme.spacing(0.5, 1.25),
  '&:hover': {
    borderColor: theme.palette.button.color,
    color: theme.palette.button.color,
  },
}))

const messages = {
  label: 'Choix possibles',
  placeholder: 'Saisissez un choix',
  add: 'Ajouter un choix',
}

const initialChoice = [{ content: '' }]
const addMissingId = element => (element.id ? element : { ...element, id: uuid() })

const Choices = ({ formValues, updateFormField }) => {
  const [allChoices, setAllChoices] = useState([])

  useEffect(() => {
    setAllChoices(formValues.map(addMissingId))
  }, [formValues])

  const updateChoiceField = useCallback(
    (choiceId, value) => {
      const choices = [].concat(allChoices)
      const index = choices.findIndex(({ id }) => id === choiceId)
      choices[index] = { ...choices[index], content: value }
      return choices
    },
    [allChoices]
  )

  const handleFieldChange = (choiceIndex, value) => {
    const choices = updateChoiceField(choiceIndex, value)
    updateFormField(fields.choices, choices)
  }

  const handleAddChoice = () => {
    const choices = [].concat(allChoices).concat(initialChoice)
    updateFormField(fields.choices, choices)
  }

  const handleDeleteChoice = choiceId => () => {
    const choices = allChoices.filter(({ id }) => id !== choiceId)
    updateFormField(fields.choices, choices)
  }

  return (
    <>
      <Grid container sx={{ pt: 3 }}>
        <UIInputLabel data-cy="surveys-create-edit-choices-label">{messages.label}</UIInputLabel>
      </Grid>

      <Grid container>
        {allChoices.map((choice, index) => (
          <UIInput
            data-cy="surveys-create-edit-choice-input"
            key={choice.id}
            name={fields.question}
            placeholder={messages.placeholder}
            value={choice.content}
            onChange={event => handleFieldChange(choice.id, event.target.value)}
            InputProps={
              index > 1
                ? {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          data-cy="surveys-create-edit-choice-delete-action"
                          onClick={handleDeleteChoice(choice.id)}
                          sx={{ color: 'form.label.color' }}
                          disableRipple
                        >
                          <DeleteRoundedIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }
                : null
            }
            sx={{ mt: 1 }}
          />
        ))}

        <AddChoiceButton
          data-cy="surveys-create-edit-choice-add-button"
          variant="outlined"
          startIcon={<AddRoundedIcon />}
          onClick={handleAddChoice}
          sx={{ mt: 1 }}
        >
          <ActionLabel>{messages.add}</ActionLabel>
        </AddChoiceButton>
      </Grid>
    </>
  )
}

Choices.propTypes = {
  formValues: PropTypes.arrayOf(PropTypes.shape(DomainSurveyDetailChoice.propTypes)).isRequired,
  updateFormField: PropTypes.func.isRequired,
}

export default Choices
