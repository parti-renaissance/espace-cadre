import { Button as MuiButton } from '@mui/material'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'

const Button = styled(MuiButton)(
  ({ theme }) => `
  padding: ${theme.spacing(0.5, 1.25)};
  min-width: 0;
  fontSize: 13px;
  font-weight: 500;
  line-height: 22px;
  letter-spacing: 0.46px;
`
)

export const CtaButton = ({ children, ...props }) => <Button {...props}>{children}</Button>

CtaButton.defaultProps = {
  color: null,
  hovercolor: null,
}

CtaButton.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.string,
  hovercolor: PropTypes.string,
}
