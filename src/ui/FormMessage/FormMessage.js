import PropTypes from 'prop-types'
import { styled } from '@mui/system'
import { Alert as MuiAlert, AlertTitle } from '@mui/material'
import ErrorIcon from '@mui/icons-material/Error'

const Alert = styled(MuiAlert)(
  ({ theme, severity }) => `
	display: flex;
	align-items: center;
	margin: ${theme.spacing(1, 0)};
	background: ${theme.palette.form[severity].background};
`
)

const Message = styled(props => <AlertTitle component="span" {...props} />)(
  ({ theme, severity }) => `
	margin: 0;
	padding: 0;
	font-size: 13px;
	color: ${theme.palette.form[severity].color};
`
)

const Icon = styled(ErrorIcon)`
  color: ${({ theme, severity }) => theme.palette.form[severity].color};
`

const UIFormMessage = ({ children, severity }) => (
  <Alert severity={severity} icon={<Icon severity={severity} />}>
    <Message severity={severity}>{children}</Message>
  </Alert>
)

export default UIFormMessage

UIFormMessage.propTypes = {
  children: PropTypes.node.isRequired,
  severity: PropTypes.string.isRequired,
}
