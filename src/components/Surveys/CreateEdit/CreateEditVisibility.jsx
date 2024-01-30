import PropTypes from 'prop-types'
import { FormControlLabel, Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'

import { fields } from './shared/constants'
import { Checkbox } from '~/ui/Checkbox/Checkbox'

const Disclaimer = styled(Typography)(
  ({ theme }) => `
  fontSize: 14px;
  fontWeight: 400;
  lineHeight: 21px;
  color: ${theme.palette.form.label.color};
  opacity: 0.8;
`
)

const CheckboxLabelStyles = {
  fontSize: '13px',
  fontWeight: 500,
  lineHeight: '20px',
  color: 'form.label.color',
  '&:first-letter': {
    textTransform: 'uppercase',
  },
}

const messages = {
  label: 'Rendre ce questionnaire visible',
  disclaimer:
    'Si vous activez cette fonction, ce questionnaire sera visible de vos militants dans la partie questionnaires de l’application.',
}

const CreateEditVisibility = ({ formValues, updateFormField }) => (
  <Grid container sx={{ pt: 3 }}>
    <FormControlLabel
      name={fields.isPublished}
      label={messages.label}
      value={formValues.isPublished}
      control={<Checkbox size="small" checked={!!formValues.isPublished} sx={{ p: 1.5 }} />}
      onChange={(_, value) => updateFormField(fields.isPublished, value)}
      componentsProps={{ typography: { sx: CheckboxLabelStyles } }}
      sx={{ height: '20px', mx: 0 }}
    />
    <Disclaimer sx={{ pt: 1 }}>{messages.disclaimer}</Disclaimer>
  </Grid>
)

CreateEditVisibility.propTypes = {
  formValues: PropTypes.shape({
    isPublished: PropTypes.bool.isRequired,
  }),
  updateFormField: PropTypes.func.isRequired,
}

export default CreateEditVisibility
