import PropTypes from 'prop-types'
import { useCallback, useEffect, useState } from 'react'
import { styled } from '@mui/system'
import { Button, Grid, IconButton, InputAdornment } from '@mui/material'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { v4 as uuid } from 'uuid'

import { SurveyDetailChoice as DomainSurveyDetailChoice } from 'domain/surveys'
import { Input, Label } from '../shared/components/styled'
import { fields } from '../shared/constants'

const AddChoiceButton = styled(props => <Button variant="outlined" {...props} />)(({ theme }) => ({
  borderColor: theme.palette.main,
  color: theme.palette.main,
  padding: theme.spacing(0.5, 1.25),
  '&:hover': {
    borderColor: theme.palette.main,
    color: theme.palette.main,
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
    const choices = formValues
    setAllChoices(choices.map(addMissingId))
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
        <Label>{messages.label}</Label>
      </Grid>

      <Grid container>
        {allChoices.map((choice, index) => (
          <Input
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
                        <IconButton onClick={handleDeleteChoice(choice.id)} sx={{ color: 'form.label.color' }}>
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

        <AddChoiceButton variant="outlined" startIcon={<AddRoundedIcon />} onClick={handleAddChoice} sx={{ mt: 1 }}>
          {messages.add}
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
