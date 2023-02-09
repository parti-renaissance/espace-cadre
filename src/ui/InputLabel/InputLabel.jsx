import { styled } from '@mui/system'
import { InputLabel as MuiInputLabel, Typography } from '@mui/material'

export const InputLabel = styled(({ children, isRequired = false, ...props }) => (
  <MuiInputLabel {...props}>
    <Typography variant="subtitle1">{children}</Typography>
    {isRequired && (
      <Typography variant="subtitle1" color="error">
        {' '}
        *
      </Typography>
    )}
  </MuiInputLabel>
))(
  ({ theme }) => `
		line-height: 16px;
		color: ${theme.palette.form.label.color};
`
)

export default InputLabel
