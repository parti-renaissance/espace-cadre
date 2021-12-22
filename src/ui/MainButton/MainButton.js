import { Button as MuiButton } from '@mui/material'
import PropTypes from 'prop-types'
import { styled } from '@mui/system'

const Button = styled(MuiButton)`
  color: ${({ theme }) => theme.palette.button.color};
  background: ${({ theme }) => theme.palette.button.background.main};
  &:hover {
    background: ${({ theme }) => theme.palette.button.background.hover};
  }
  height: 35px;
  padding: ${({ theme }) => theme.spacing(0.75, 2)};
`

const MainButton = ({ children, handleClick, disabled = false }) => (
  <Button variant="contained" onClick={handleClick} disabled={disabled}>
    {children}
  </Button>
)

export default MainButton

MainButton.propTypes = {
  children: PropTypes.node.isRequired,
  handleClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
}
