import { styled } from '@mui/system'
import { Checkbox as MuiCheckbox } from '@mui/material'

export const Checkbox = styled(MuiCheckbox)(() => ({
  '&.Mui-checked': {
    color: '#2834C3',
  },
}))
