import PropTypes from 'prop-types'
import { styled } from '@mui/system'
import { FormControlLabel, Grid, Radio, RadioGroup, Typography } from '@mui/material'

import UIInputLabel from '~/ui/InputLabel/InputLabel'
import { multipleChoice, simpleField, uniqueChoice } from '../../shared/constants'

const ChoiceLabel = styled(Typography)`
  font-size: 13px;
  font-weight: 600;
  line-height: 20px;
`

const messages = {
  label: 'Type de question',
  simpleField: 'Réponse libre',
  multipleChoice: 'Choix multiples',
  uniqueChoice: 'Choix uniques',
}

const QuestionTypes = ({ selectedType, handleChange }) => (
  <>
    <Grid container>
      <UIInputLabel data-cy="surveys-create-edit-question-type-label">{messages.label}</UIInputLabel>
    </Grid>

    <Grid container sx={{ pt: 2 }}>
      <RadioGroup name="question-type" defaultValue={simpleField} value={selectedType} row>
        <FormControlLabel
          data-cy="surveys-create-edit-question-type-simple-field"
          control={<Radio onChange={handleChange} sx={{ color: 'main' }} />}
          label={<ChoiceLabel>{messages.simpleField}</ChoiceLabel>}
          value={simpleField}
        />
        <FormControlLabel
          data-cy="surveys-create-edit-question-type-multiple-choice"
          control={<Radio onChange={handleChange} sx={{ color: 'main' }} />}
          label={<ChoiceLabel>{messages.multipleChoice}</ChoiceLabel>}
          value={multipleChoice}
        />
        <FormControlLabel
          data-cy="surveys-create-edit-question-type-unique-choice"
          control={<Radio onChange={handleChange} sx={{ color: 'main' }} />}
          label={<ChoiceLabel>{messages.uniqueChoice}</ChoiceLabel>}
          value={uniqueChoice}
        />
      </RadioGroup>
    </Grid>
  </>
)

QuestionTypes.propTypes = {
  selectedType: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
}

export default QuestionTypes
