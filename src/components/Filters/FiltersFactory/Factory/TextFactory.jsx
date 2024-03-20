import { TextField as MuiTextField } from '@mui/material'
import { styled } from '@mui/system'

const TextField = styled(MuiTextField)`
  width: 100%;
`

class TextFactory {
  getType() {
    return 'text'
  }

  create({ filter, onChange, value }) {
    return (
      <TextField
        variant="outlined"
        placeholder={filter.place_holder}
        name={filter.code}
        label={filter.label}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    )
  }
}

export default TextFactory
