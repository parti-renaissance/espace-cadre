import { Button as MuiButton } from '@mui/material'
import PropTypes from 'prop-types'
import { styled } from '@mui/system'
import { shouldForwardProps } from 'components/shared/shouldForwardProps'

const MainButton = styled(
  MuiButton,
  shouldForwardProps
)(
  ({ theme, isMainButton }) => `
  color: ${theme.palette.button.color.main};
  background: ${isMainButton ? 'rgba(55, 67, 200, 0.08)' : theme.palette.button.background.main};
  &:hover {
    background: ${isMainButton ? 'rgba(0, 0, 0, 0.08)' : theme.palette.button.background.main};
  }
  &.Mui-disabled {
    color: ${theme.palette.button.color.disabled};
    background-color: ${theme.palette.button.background.disabled};
  }
  height: 35px;
  border-radius: 8px;
  border: none;
  padding: ${theme.spacing(0.75, 2)};
`
)

const Button = ({ children, onClick, rootProps, disabled = false, isMainButton }) => (
  <MainButton variant="contained" onClick={onClick} {...rootProps} disabled={disabled} isMainButton={isMainButton}>
    {children}
  </MainButton>
)

export default Button

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  rootProps: PropTypes.object,
  disabled: PropTypes.bool,
  isMainButton: PropTypes.bool,
}
