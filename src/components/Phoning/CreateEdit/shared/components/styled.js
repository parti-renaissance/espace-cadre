import { styled } from '@mui/system'
import { Checkbox as MuiCheckbox, InputLabel, TextField, Typography } from '@mui/material'
import MuiPickersDay from '@mui/lab/PickersDay'

export const StepTitle = styled(Typography)(
  ({ theme }) => `
	font-size: 18px;
	font-weight: 600;
	line-height: 18px;
	color: ${theme.palette.stepper.stepTitle.color};
`
)

export const Checkbox = styled(MuiCheckbox)(({ theme }) => ({
  '&.Mui-checked': {
    color: theme.palette.campaign.color,
  },
}))

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

export const Input = styled(props => <TextField size="small" variant="outlined" fullWidth {...props} />)(
  ({ theme, name }) => ({
    '& .MuiOutlinedInput-root': {
      padding: name === 'brief' ? theme.spacing(1.75) : 'inherit',
      paddingLeft: name !== 'brief' ? 0 : theme.spacing(1.75),
      background: theme.palette.form.input.background,
      borderRadius: '8px',
      [`& input[name=${name}]`]: {
        height: '24px',
        padding: ['endDate', 'adherentFromDate', 'adherentToDate'].includes(name)
          ? theme.spacing(1.75, 2, 1.25, 0)
          : theme.spacing(1.5, 2),
        '&::placeholder': {
          letterSpacing: ['endDate', 'adherentFromDate', 'adherentToDate'].includes(name) ? '-3px' : 'inherit',
        },
      },
      '& fieldset': {
        border: 'none',
      },
      '&.Mui-focused fieldset': {
        border: `2px solid ${theme.palette.form.input.borderColor.focus}`,
      },
      '& .MuiInputAdornment-root': {
        marginRight: 0,
        '& .MuiIconButton-root': {
          padding: theme.spacing(0, 1),
        },
      },
      '& .MuiChip-root': {
        marginLeft: theme.spacing(1),
        padding: theme.spacing(0.25),
        backgroundColor: theme.palette.campaign.background.chip.input,
        color: theme.palette.whiteCorner,
        '& .MuiChip-deleteIcon': {
          color: theme.palette.whiteCorner,
        },
      },
      '& .MuiChip-label': {
        padding: theme.spacing(2),
      },
    },
  })
)

export const PickersDay = styled(MuiPickersDay)(({ theme }) => ({
  '&:not(.Mui-selected)': {
    borderColor: theme.palette.campaign.color,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.campaign.color,
      color: theme.palette.whiteCorner,
    },
  },
  '&.Mui-selected': {
    borderColor: 'transparent',
    backgroundColor: theme.palette.campaign.color,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.campaign.color,
      color: theme.palette.whiteCorner,
    },
  },
}))
