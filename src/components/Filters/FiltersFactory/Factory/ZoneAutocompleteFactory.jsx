import { Box, FormControl as MuiFormControl, Typography } from '@mui/material'
import { styled } from '@mui/system'
import Autocomplete from 'components/Filters/Element/Autocomplete'
import { zoneLabels, zoneTypeColors } from 'domain/zone'
import { UIChip } from 'ui/Card'

const FormControl = styled(MuiFormControl)`
  width: 100%;
  & .MuiOutlinedInput-notchedOutline {
    border: none;
  }
`

class ZoneAutocompleteFactory {
  getType() {
    return 'zone_autocomplete'
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
          labelParam={filter.options.label_param}
          required={filter.options.required || false}
          multiple={filter.options.multiple}
          getOptionLabel={option => option[filter.options.label_param]}
          renderOption={(props, option) => (
            <li {...props} key={option[filter.options.value_param]}>
              <Box className="space-x-2">
                <Typography size="small">{option[filter.options.label_param]}</Typography>
                <UIChip color="whiteCorner" bgcolor={zoneTypeColors[option.type]} label={zoneLabels[option.type]} />
              </Box>
            </li>
          )}
          defaultValue={defaultValue}
        />
      </FormControl>
    )
  }
}

export default ZoneAutocompleteFactory
