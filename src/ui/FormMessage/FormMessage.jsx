import PropTypes from 'prop-types'
import { styled } from '@mui/system'
import { Alert as MuiAlert, AlertTitle as MuiAlertTitle } from '@mui/material'
import ErrorIcon from '@mui/icons-material/Error'
import { shouldForwardProps } from '~/components/shared/shouldForwardProps'

const Alert = styled(MuiAlert)(
  ({ theme, severity }) => `
	display: flex;
	align-items: center;
	margin: ${theme.spacing(1, 0)};
	background: ${theme.palette.form[severity].background};
`
)

const AlertTitle = styled(
  props => <MuiAlertTitle component="span" {...props} />,
  shouldForwardProps
)(
  ({ theme, severity }) => `
	margin: 0;
	padding: 0;
	font-size: 13px;
	color: ${theme.palette.form[severity].color};
`
)

const Icon = styled(ErrorIcon, shouldForwardProps)`
  color: ${({ theme, severity }) => theme.palette.form[severity].color};
`

const UIFormMessage = ({ children, severity }) => (
  <Alert severity={severity} icon={<Icon severity={severity} />}>
    <AlertTitle severity={severity}>{children}</AlertTitle>
  </Alert>
)

export default UIFormMessage

UIFormMessage.propTypes = {
  children: PropTypes.node.isRequired,
  severity: PropTypes.string.isRequired,
}
