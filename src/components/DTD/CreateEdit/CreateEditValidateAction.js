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
      palette: { campaign },
    },
    disabled,
  }) => ({
    height: '42px',
    background: !disabled ? campaign.button.background.main : campaign.button.background.disabled,
    color: !disabled ? campaign.button.color.main : campaign.button.color.disabled,
    borderRadius: '8px',
    '&:hover': {
      background: !disabled ? campaign.button.background.main : campaign.button.background.disabled,
      color: !disabled ? campaign.button.color.main : campaign.button.color.disabled,
    },
  })
)

const ValidateAction = ({ label, handleValidate, disabled }) => (
  <Grid container sx={{ pt: 6 }}>
    <ValidateButton onClick={handleValidate} disabled={disabled}>
      {label}
    </ValidateButton>
  </Grid>
)

ValidateAction.propTypes = {
  label: PropTypes.string.isRequired,
  handleValidate: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
}

export default ValidateAction
