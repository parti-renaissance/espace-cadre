import { Button as MuiButton } from '@mui/material'
import PropTypes from 'prop-types'
import { styled } from '@mui/system'
import { shouldForwardProps } from '~/components/shared/shouldForwardProps'
import Loader from '~/ui/Loader'

const MainButton = styled(
  MuiButton,
  shouldForwardProps
)(
  ({ theme, isMainButton }) => `
  color: ${isMainButton ? theme.palette.button.color.main : theme.palette.whiteCorner};
  background: ${isMainButton ? 'rgba(55, 67, 200, 0.08)' : theme.palette.button.background.main};
  &:hover {
    background: ${isMainButton ? 'rgba(0, 0, 0, 0.08)' : theme.palette.colors.blue[700]};
  }
  &.Mui-disabled {
    color: ${theme.palette.button.color.disabled};
    background-color: ${theme.palette.button.background.disabled};
  }
  min-height: 35px;
  border-radius: 8px;
  border: none;
  padding: ${theme.spacing(0.75, 2)};
`
)

const MainDangerButton = styled(
  MainButton,
  shouldForwardProps
)(
  ({ theme }) => `
  color: ${theme.palette.colors.white};
  background: ${theme.palette.statusError};
  &:hover {
    background: ${theme.palette.red600};
  }
  &.Mui-disabled {
    color: ${theme.palette.colors.white};
    background-color: ${theme.palette.red600};
  }
`
)

const Button = ({ children, onClick, rootProps = undefined, disabled = false, ...props }) => (
  <MainButton variant="contained" onClick={onClick} disabled={disabled} {...rootProps} {...props}>
    {children}
  </MainButton>
)

export const ActionButton = ({ children, handleSubmit, isLoading = false, disabled = false, ...props }) => (
  <Button
    disabled={isLoading || disabled}
    onClick={handleSubmit}
    rootProps={{ sx: { color: 'whiteCorner', mr: 2 } }}
    {...props}
  >
    {isLoading && <Loader />}&nbsp;
    {children}
  </Button>
)

export const DangerButton = ({ children, onClick, rootProps, disabled = false, isLoading = false }) => (
  <MainDangerButton variant="contained" onClick={onClick} {...rootProps} disabled={isLoading || disabled}>
    {isLoading && <Loader />}&nbsp;
    {children}
  </MainDangerButton>
)

export default Button

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  rootProps: PropTypes.object,
  disabled: PropTypes.bool,
  isMainButton: PropTypes.bool,
}

ActionButton.propTypes = {
  children: PropTypes.node.isRequired,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  handleSubmit: PropTypes.func,
  rootProps: PropTypes.object,
}

DangerButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  rootProps: PropTypes.object,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
}
