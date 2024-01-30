import { Button as MuiButton } from '@mui/material'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Loader from '~/ui/Loader'
import { shouldForwardProps } from '~/components/shared/shouldForwardProps'

const Button = styled(
  MuiButton,
  shouldForwardProps
)(
  ({ theme, disabled }) => `
  width: 100%;
  border-radius: 8px;
  color: ${disabled ? theme.palette.button.color.disabled : theme.palette.whiteCorner};
  background: ${disabled ? theme.palette.button.background.disabled : theme.palette.main};
  &:hover {
    background: ${theme.palette.blue800};
  }
`
)

const StepButton = ({ disabled, loading, onClick, label, showIcon }) => (
  <Button onClick={disabled ? null : onClick} size="large" disabled={disabled} data-cy="step-button">
    {loading ? (
      <Loader size={24} />
    ) : (
      <>
        {label}
        {showIcon && <ArrowForwardIcon sx={{ ml: 1.5 }} />}
      </>
    )}
  </Button>
)

export default StepButton

StepButton.defaultProps = {
  disabled: false,
  loading: false,
  showIcon: true,
}

StepButton.propTypes = {
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  showIcon: PropTypes.bool,
}
