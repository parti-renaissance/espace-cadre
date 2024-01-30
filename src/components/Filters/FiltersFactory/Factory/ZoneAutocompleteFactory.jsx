import { Box, Typography } from '@mui/material'
import { zoneLabels, zoneTypeColors } from '~/domain/zone'
import { UIChip } from '~/ui/Card'
import AutocompleteFactory from './AutocompleteFactory'

class ZoneAutocompleteFactory extends AutocompleteFactory {
  getType() {
    return 'zone_autocomplete'
  }

  create(params) {
    const { filter } = params
    return super.create({
      ...params,
      renderOption: (props, option) => (
        <li {...props} key={option[filter.options.value_param]}>
          <Box className="space-x-2">
            <Typography size="small">{option[filter.options.label_param]}</Typography>
            <UIChip color="whiteCorner" bgcolor={zoneTypeColors[option.type]} label={zoneLabels[option.type]} />
          </Box>
        </li>
      ),
    })
  }
}

export default ZoneAutocompleteFactory
