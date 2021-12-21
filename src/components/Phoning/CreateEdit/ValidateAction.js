import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { useFormikContext } from 'formik'
import { Grid, Button } from '@mui/material'
import { styled } from '@mui/system'

import { shouldForwardProps } from 'components/shared/shouldForwardProps'

const ValidateButton = styled(
  props => <Button fullWidth {...props} />,
  shouldForwardProps
)(({ theme: { palette: { phoning = {} } = {} }, isFormValid }) => ({
  height: '42px',
  background: isFormValid === true ? phoning.button.background.main : phoning.button.background.disabled,
  color: isFormValid === true ? phoning.button.color.main : phoning.button.color.disabled,
  borderRadius: '8px',
  '&:hover': {
    background: isFormValid === true ? phoning.button.background.main : phoning.button.background.disabled,
    color: isFormValid === true ? phoning.button.color.main : phoning.button.color.disabled,
  },
}))

const ValidateAction = ({ label }) => {
  const { values, handleSubmit } = useFormikContext()
  const isFormValid = useMemo(
    () =>
      !!(
        values.title &&
        values.goal &&
        values.endDate &&
        values.brief &&
        values.team &&
        values.survey &&
        Object.keys(values.filters).length > 0
      ),
    [values]
  )

  return (
    <Grid container sx={{ pt: 6 }}>
      <ValidateButton onClick={handleSubmit} disabled={isFormValid === false} isFormValid={isFormValid}>
        {label}
      </ValidateButton>
    </Grid>
  )
}

ValidateAction.propTypes = {
  label: PropTypes.string.isRequired,
}

export default ValidateAction
