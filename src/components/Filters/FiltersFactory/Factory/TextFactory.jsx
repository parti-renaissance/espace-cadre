import { TextField as MuiTextField } from '@mui/material'
import { styled } from '@mui/system'

const TextField = styled(MuiTextField)`
  background: ${({ theme }) => theme.palette.whiteCorner};
  border-radius: 8px;
  width: 100%;

  & .MuiOutlinedInput-notchedOutline {
    border: none;
  }
`

class TextFactory {
  getType() {
    return 'text'
  }

  create({ filter, onChange, value }) {
    return (
      <TextField
        variant="outlined"
        size="small"
        name={filter.code}
        label={filter.label}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    )
  }
}

export default TextFactory
