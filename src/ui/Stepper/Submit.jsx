import PropTypes from 'prop-types'
import { Grid, Button } from '@mui/material'
import { styled } from '@mui/system'
import Loader from '~/ui/Loader'
import { shouldForwardProps } from '~/components/shared/shouldForwardProps'

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

const Submit = ({ label, handleValidate, disabled, isLoading }) => (
  <Grid container sx={{ pt: 6 }}>
    <ValidateButton onClick={handleValidate} disabled={disabled}>
      {isLoading && <Loader color="whiteCorner" />}&nbsp;
      {label}
    </ValidateButton>
  </Grid>
)

Submit.propTypes = {
  label: PropTypes.string.isRequired,
  handleValidate: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool,
}

export default Submit
