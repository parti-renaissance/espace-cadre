import PropTypes from 'prop-types'
import Autocomplete from 'components/Filters/Element/Autocomplete'
import { zoneAutocompleteUri } from 'api/elected-representative'

const ZoneAutocomplete = ({ onChange, value, customStyle, ...props }) => (
  <Autocomplete
    onChange={onChange}
    value={value}
    customStyle={customStyle}
    uri={zoneAutocompleteUri}
    queryParam="q"
    valueParam="uuid"
    {...props}
  />
)

export default ZoneAutocomplete

ZoneAutocomplete.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  customStyle: PropTypes.object,
}
