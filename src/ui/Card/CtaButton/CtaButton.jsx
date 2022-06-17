import { Button as MuiButton } from '@mui/material'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'

const Button = styled(MuiButton)(
  ({ theme }) => `
  color: ${theme.palette.button.color.main};
  &:hover {
    background: ${theme.palette.button.background.hover};
  }
  border-radius: 8px;
  padding: ${theme.spacing(0.5, 1.25)};
  margin-left: -8px;
  min-width: 0;
`
)

export const CtaButton = ({ children, ...props }) => <Button {...props}>{children}</Button>

CtaButton.propTypes = {
  children: PropTypes.node.isRequired,
}
