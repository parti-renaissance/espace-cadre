import PropTypes from 'prop-types'
import Autocomplete from 'components/Filters/Element/Autocomplete'

export const ZONE_AUTOCOMPLETE_URI = '/api/v3/zone/autocomplete'

const ZoneAutocomplete = ({ onChange, value, customStyle, ...props }) => (
  <Autocomplete
    onChange={onChange}
    value={value}
    customStyle={customStyle}
    uri={ZONE_AUTOCOMPLETE_URI}
    queryParam="q"
    valueParam="uuid"
    getOptionLabel={option => `${option.name} (${option.code})`}
    {...props}
  />
)

export default ZoneAutocomplete

ZoneAutocomplete.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  customStyle: PropTypes.object,
}
