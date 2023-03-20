import { FormControl as MuiFormControl } from '@mui/material'
import { styled } from '@mui/system'
import Autocomplete from 'components/Filters/Element/Autocomplete'
import { zoneLabels } from 'domain/zone'

const FormControl = styled(MuiFormControl)`
  width: 100%;
  & .MuiOutlinedInput-notchedOutline {
    border: none;
  }
`

class AutocompleteFactory {
  getType() {
    return 'autocomplete'
  }

  create({ filter, onChange, value, defaultValue }) {
    return (
      <FormControl size="small">
        <Autocomplete
          placeholder={filter.label}
          uri={filter.options.url}
          value={value}
          onChange={onChange}
          queryParam={filter.options.query_param}
          valueParam={filter.options.value_param}
          labelParam={
            typeof filter.options.label_param === 'string' ? filter.options.label_param : filter.options.label_param[0]
          }
          required={filter.options.required || false}
          multiple={filter.options.multiple}
          getOptionLabel={option =>
            typeof filter.options.label_param === 'string'
              ? option[filter.options.label_param]
              : `${option[filter.options.label_param[0]]} (${zoneLabels[option[filter.options.label_param[1]]]})`
          }
          defaultValue={defaultValue}
        />
      </FormControl>
    )
  }
}

export default AutocompleteFactory
