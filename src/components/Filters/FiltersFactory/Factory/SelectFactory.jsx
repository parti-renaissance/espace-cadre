import { ListItemText, MenuItem, Select, InputLabel, FormControl } from '@mui/material'
import { Checkbox } from '~/ui/Checkbox/Checkbox'
import EqualNotEqualSelect from '~/components/Filters/Element/EqualNotEqualSelect.jsx'
import InputRow from '~/components/Filters/Element/InputRow.jsx'
import { useMemo } from 'react'

const filterValue = value => {
  if (Array.isArray(value)) {
    return value.map(v => (v.startsWith('!') ? v.slice(1) : v))
  }
  return value.startsWith('!') ? value.slice(1) : value
}

class SelectFactory {
  getType() {
    return 'select'
  }

  create({ filter, onChange, value }) {
    const multiple = filter.options && !!filter.options.multiple
    const selectValue = multiple && !Array.isArray(value) ? [value].filter(element => element !== '') : value

    const equalNotEqualValue = useMemo(
      () => ((Array.isArray(selectValue) ? (selectValue[0] ?? '') : selectValue).startsWith('!') ? '0' : '1'),
      [selectValue]
    )

    return (
      <InputRow>
        {!!filter.options.advanced && (
          <EqualNotEqualSelect
            value={equalNotEqualValue}
            onChange={event => {
              let newValue = filterValue(selectValue)

              if (Array.isArray(newValue)) {
                newValue = newValue.map(v => (event.target.value === 0 ? `!${v}` : v))
              } else {
                newValue = event.target.value === 0 ? `!${newValue}` : newValue
              }
              onChange(newValue)
            }}
          />
        )}

        <FormControl
          variant="outlined"
          required={filter.options.required || false}
          sx={{
            width: '100%',
          }}
        >
          <InputLabel id="simple-select" sx={{ backgroundColor: 'white', px: 1 }}>
            {filter.label}
          </InputLabel>

          <Select
            labelId="simple-select"
            onChange={e => onChange(e.target.value)}
            required={filter.options.required || false}
            value={filterValue(selectValue)}
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
      </InputRow>
    )
  }
}

export default SelectFactory
