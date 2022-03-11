import { Button as MuiButton } from '@mui/material'
import PropTypes from 'prop-types'
import { styled } from '@mui/system'

const Button = styled(MuiButton)(
  ({ theme }) => `
  color: ${theme.palette.button.color};
  background: ${theme.palette.button.background.main};
  &:hover {
    background: ${theme.palette.button.background.hover};
  }
  height: 35px;
  padding: ${theme.spacing(0.75, 2)};
`
)

const MainButton = ({ children, onClick, rootProps }) => (
  <Button variant="contained" onClick={onClick} {...rootProps}>
    {children}
  </Button>
)

export default MainButton

MainButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  rootProps: PropTypes.object,
}
