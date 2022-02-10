import { styled } from '@mui/system'
import { InputLabel, Typography } from '@mui/material'
import PropTypes from 'prop-types'

const messages = {
  optional: '(optionnel)',
}

const Label = styled(({ children, optional = false, ...props }) => (
  <InputLabel {...props}>
    <Typography variant="subtitle1">{children}</Typography>
    {optional && (
      <Typography variant="subtitle2" sx={{ color: 'form.label.color' }}>
        &nbsp;{messages.optional}
      </Typography>
    )}
  </InputLabel>
))(
  ({ theme }) => `
	line-height: 16px;
	color: ${theme.palette.form.label.color};
`
)

Label.propTypes = {
  optional: PropTypes.bool,
  children: PropTypes.node.isRequired,
}

export default Label
