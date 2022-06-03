import { styled } from '@mui/system'
import { InputLabel, OutlinedInput, Select as MuiSelect, Typography } from '@mui/material'

export const Label = styled(({ children, ...props }) => (
  <InputLabel {...props}>
    <Typography variant="subtitle1">{children}</Typography>
  </InputLabel>
))(
  ({ theme }) => `
	line-height: 16px;
	color: ${theme.palette.form.label.color};
`
)

export const Select = styled(props => (
  <MuiSelect
    input={<OutlinedInput size="small" name={props.name} placeholder={props.placeholder} />}
    fullWidth
    {...props}
  />
))(({ theme }) => ({
  background: theme.palette.form.input.background,
  borderRadius: '8px',
  '& .MuiOutlinedInput-root': {},
  '& .MuiOutlinedInput-input': {
    padding: theme.spacing(1.5, 2),
  },
  '& fieldset': {
    border: 'none',
  },
  '&.Mui-focused fieldset.MuiOutlinedInput-notchedOutline': {
    border: `2px solid ${theme.palette.form.input.borderColor.focus}`,
  },
}))
