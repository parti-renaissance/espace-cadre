import PropTypes from 'prop-types'
import { Grid, Button } from '@mui/material'
import { styled } from '@mui/system'

import { shouldForwardProps } from 'components/shared/shouldForwardProps'

const ValidateButton = styled(
  props => <Button fullWidth {...props} />,
  shouldForwardProps
)(
  ({
    theme: {
      palette: { main, campaign },
    },
    disabled,
  }) => ({
    height: '42px',
    background: !disabled ? main : campaign.button.background.disabled,
    color: !disabled ? campaign.button.color.main : campaign.button.color.disabled,
    borderRadius: '8px',
    '&:hover': {
      background: !disabled ? main : campaign.button.background.disabled,
      color: !disabled ? campaign.button.color.main : campaign.button.color.disabled,
    },
  })
)

const Submit = ({ label, handleValidate, disabled }) => (
  <Grid container sx={{ pt: 6 }}>
    <ValidateButton onClick={handleValidate} disabled={disabled}>
      {label}
    </ValidateButton>
  </Grid>
)

Submit.propTypes = {
  label: PropTypes.string.isRequired,
  handleValidate: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
}

export default Submit
