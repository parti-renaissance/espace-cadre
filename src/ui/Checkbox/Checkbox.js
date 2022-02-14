import { styled } from '@mui/system'
import { Checkbox as MuiCheckbox } from '@mui/material'

export const Checkbox = styled(MuiCheckbox)(({ theme }) => ({
  '&.Mui-checked': {
    color: theme.palette.campaign.color,
  },
}))
