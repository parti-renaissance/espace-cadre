import { styled } from '@mui/system'
import { Checkbox as MuiCheckbox } from '@mui/material'

export const Checkbox = styled(props => <MuiCheckbox {...props} data-cy="ui-checkbox" />)(() => ({
  '&.Mui-checked': {
    color: '#2834C3',
  },
}))
