import PropTypes from 'prop-types'
import qs from 'qs'
import { Box, Typography } from '@mui/material'
import Autocomplete from 'components/Filters/Element/Autocomplete'
import { zoneLabels, zoneTypeColors } from 'domain/zone'
import { UIChip } from 'ui/Card'

export const ZONE_AUTOCOMPLETE_URI = '/api/v3/zone/autocomplete'

const ZoneAutocomplete = ({ onChange, value, customStyle, initialParams = {}, ...props }) => {
  const fullUri = `${ZONE_AUTOCOMPLETE_URI}?${qs.stringify(initialParams)}`

  return (
    <Autocomplete
      onChange={onChange}
      value={value}
      customStyle={customStyle}
      uri={fullUri}
      queryParam="q"
      valueParam="uuid"
      getOptionLabel={option => `${option.name} (${option.code})`}
      renderOption={(props, option) => (
        <li {...props} key={option.uuid}>
          <Box className="space-x-4">
            <Typography size="small">{`${option.name} (${option.code})`}</Typography>
            <UIChip color="whiteCorner" bgcolor={zoneTypeColors[option.type]} label={zoneLabels[option.type]} />
          </Box>
        </li>
      )}
      {...props}
    />
  )
}

export default ZoneAutocomplete

ZoneAutocomplete.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  customStyle: PropTypes.object,
  initialParams: PropTypes.object,
}
