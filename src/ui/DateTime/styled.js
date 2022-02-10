import { styled } from '@mui/system'
import MuiPickersDay from '@mui/lab/PickersDay'

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
