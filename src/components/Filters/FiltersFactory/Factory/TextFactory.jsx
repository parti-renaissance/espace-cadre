import { TextField } from '@mui/material'
import Iconify from '~/mui/iconify'
import { grey } from '~/theme/palette'

class TextFactory {
  getType() {
    return 'text'
  }

  create({ filter, onChange, value }) {
    const renderIconOrUndefined = icon => (icon ? <Iconify icon={icon} color={iconColor} sx={{ mr: 1 }} /> : undefined)
    const isResearch = filter.code === 'searchTerm'

    const InputProps = {
      startAdornment:
        filter.code === 'searchTerm'
          ? renderIconOrUndefined('eva:search-fill')
          : renderIconOrUndefined(value.start_icon),
      endAdornment: renderIconOrUndefined(value.end_icon),
    }

    return (
      <TextField
        fullWidth
        variant="outlined"
        placeholder={
          isResearch && !filter.place_holder ? 'Prénom, nom, email, numéro adhérent...' : filter.place_holder
        }
        name={filter.code}
        label={!isResearch ? filter.label : undefined}
        value={value}
        InputProps={InputProps}
        onChange={e => onChange(e.target.value)}
      />
    )
  }
}

const iconColor = grey[500]

export default TextFactory
