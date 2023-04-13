import { FormControl as MuiFormControl } from '@mui/material'
import { styled } from '@mui/system'
import Autocomplete from 'components/Filters/Element/Autocomplete'

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

  create({ filter, onChange, value, defaultValue, renderOption }) {
    return (
      <FormControl size="small">
        <Autocomplete
          placeholder={filter.label}
          uri={filter.options.url}
          value={value}
          onChange={onChange}
          queryParam={filter.options.query_param}
          valueParam={filter.options.value_param}
          labelParam={filter.options.label_param}
          required={filter.options.required || false}
          multiple={filter.options.multiple}
          getOptionLabel={option => option[filter.options.label_param] || ''}
          renderOption={renderOption}
          defaultValue={defaultValue}
        />
      </FormControl>
    )
  }
}

export default AutocompleteFactory
