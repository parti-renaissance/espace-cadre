import { styled } from '@mui/system'
import { TextField } from '@mui/material'

const Input = styled(props => <TextField size="small" variant="outlined" fullWidth {...props} />)(
  ({ theme, name }) => ({
    '& .MuiOutlinedInput-root': {
      padding: name === 'brief' ? theme.spacing(1.75) : 'inherit',
      paddingLeft: name !== 'brief' ? 0 : theme.spacing(1.75),
      background: theme.palette.form.input.background,
      borderRadius: '8px',
      [`& input[name=${name}]`]: {
        height: '24px',
        padding: theme.spacing(1.5, 2),
        '&::placeholder': {
          letterSpacing: 'inherit',
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
        backgroundColor: theme.palette.main,
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

export default Input
