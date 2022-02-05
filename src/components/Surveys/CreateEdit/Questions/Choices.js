import PropTypes from 'prop-types'
import { useCallback, useEffect, useState } from 'react'
import { styled } from '@mui/system'
import { Button, Grid, IconButton, InputAdornment } from '@mui/material'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'

import { SurveyDetailChoice as DomainSurveyDetailChoice } from 'domain/surveys'
import { Input, Label } from '../shared/components/styled'
import { fields } from '../shared/constants'

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

const Choices = ({ formValues, updateFormField }) => {
  const [allChoices, setAllChoices] = useState([])

  useEffect(() => {
    setAllChoices(formValues)
  }, [formValues])

  const updateChoiceField = useCallback(
    (id, value) => {
      const choices = allChoices
      const choiceIndex = choices.findIndex((_, index) => index === id)
      choices[choiceIndex] = value
      return choices
    },
    [allChoices]
  )

  const handleFieldChange = (choiceIndex, value) => {
    const choices = updateChoiceField(choiceIndex, value)
    updateFormField(fields.choices, choices)
  }

  const handleAddChoice = () => {
    setAllChoices(allChoices => allChoices.concat(['']))
  }

  const handleDeleteChoice = choiceId => () => {
    setAllChoices(setAllChoices => setAllChoices.filter((_, index) => index !== choiceId))
  }

  return (
    <>
      <Grid container sx={{ pt: 3 }}>
        <Label>{messages.label}</Label>
      </Grid>

      <Grid container>
        {allChoices.map((choice, choiceIndex) => (
          <Input
            key={choiceIndex}
            name={fields.question}
            placeholder={messages.placeholder}
            value={choice.content}
            onChange={event => handleFieldChange(choiceIndex, event.target.value)}
            InputProps={
              choiceIndex > 1
                ? {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleDeleteChoice(choiceIndex)} sx={{ color: 'form.label.color' }}>
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
