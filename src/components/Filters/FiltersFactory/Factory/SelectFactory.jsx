import { ListItemText, MenuItem, Select as MuiSelect, InputLabel, FormControl } from '@mui/material'
import { Checkbox } from 'ui/Checkbox/Checkbox'
import { styled } from '@mui/system'

const Select = styled(MuiSelect)(
  ({ theme }) => `
  & .MuiSelect-select {
    background: ${theme.palette.whiteCorner};
    border-radius: 8px;

    &:focus {
      background: ${theme.palette.whiteCorner};
    }
  }
`
)

class SelectFactory {
  getType() {
    return 'select'
  }

  create({ filter, onChange, value }) {
    const multiple = filter.options && !!filter.options.multiple
    const selectValue = multiple && !Array.isArray(value) ? [value].filter(element => element !== '') : value

    return (
      <FormControl
        variant="outlined"
        size="small"
        required={filter.options.required || false}
        sx={{
          width: '100%',
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
        }}
      >
        <InputLabel id="simple-select">{filter.label}</InputLabel>
        <Select
          labelId="simple-select"
          onChange={e => onChange(e.target.value)}
          required={filter.options.required || false}
          value={selectValue}
          name={filter.code}
          multiple={multiple}
          renderValue={selected => {
            if (Array.isArray(selected)) {
              return `${filter.options.choices[selected[0]]}${selected.length > 1 ? ` +${selected.length - 1}` : ''}`
            }

            return filter.options.choices[selected]
          }}
        >
          {!multiple && (
            <MenuItem value={null}>
              <ListItemText primary="Tous" />
            </MenuItem>
          )}
          {Object.entries(filter.options.choices).map(([option1, option2]) => (
            <MenuItem key={option1} value={option1}>
              {multiple && <Checkbox checked={value !== null && value.indexOf(option1) > -1} />}
              <ListItemText primary={option2} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )
  }
}

export default SelectFactory
