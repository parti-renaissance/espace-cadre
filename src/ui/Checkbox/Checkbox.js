import { styled } from '@mui/system'
import { Checkbox as MuiCheckbox } from '@mui/material'

export const Checkbox = styled(MuiCheckbox)(() => ({
  color: '#2834C3',
  '&.Mui-checked': {
    color: '#2834C3',
  },
}))
