import { styled } from '@mui/material/styles'
import { Stack } from '@mui/material'
import PropTypes from 'prop-types'

const CustomStack = styled(Stack)`
  align-items: center;
  & > *:not(:only-child):first-of-type,
  & > *:not(:only-child):first-of-type .MuiOutlinedInput-notchedOutline {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  & > *:not(:only-child):not(:first-of-type),
  & > *:not(:only-child):not(:first-of-type) .MuiInputBase-formControl {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`

const InputRow = ({ children }) => <CustomStack direction="row">{children}</CustomStack>

export default InputRow

InputRow.propTypes = {
  children: PropTypes.node.isRequired,
}
