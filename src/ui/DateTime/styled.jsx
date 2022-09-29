import { styled } from '@mui/system'
import { PickersDay as MuiPickersDay } from '@mui/x-date-pickers/PickersDay'

export const PickersDay = styled(MuiPickersDay)(({ theme }) => ({
  '&:not(.Mui-selected)': {
    borderColor: theme.palette.main,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.main,
      color: theme.palette.whiteCorner,
    },
  },
  '&.Mui-selected': {
    borderColor: 'transparent',
    backgroundColor: theme.palette.main,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.main,
      color: theme.palette.whiteCorner,
    },
  },
}))
