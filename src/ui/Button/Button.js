import { Button as MuiButton } from '@mui/material'
import PropTypes from 'prop-types'
import { styled } from '@mui/system'

const MainButton = styled(MuiButton)(
  ({ theme }) => `
  color: ${theme.palette.button.color.main};
  background: rgba(55, 67, 200, 0.08);
  &:hover {
    background: rgba(0, 0, 0, 0.08);
  }
  height: 35px;
  border-radius: 8px;
  border: none;
  padding: ${theme.spacing(0.75, 2)};
`
)

const Button = ({ children, onClick, rootProps, disabled = false }) => (
  <MainButton variant="contained" onClick={onClick} {...rootProps} disabled={disabled}>
    {children}
  </MainButton>
)

export default Button

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  rootProps: PropTypes.object,
  disabled: PropTypes.bool,
}
