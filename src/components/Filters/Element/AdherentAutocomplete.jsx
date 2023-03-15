import Autocomplete from 'components/Filters/Element/Autocomplete'
import PropTypes from 'prop-types'

export const ADHERENT_AUTOCOMPLETE_URI = '/api/v3/adherents/autocomplete'

const AdherentAutocomplete = ({
  value,
  onChange,
  multiple = false,
  required = false,
  customStyle = {},
  placeholder = 'Rechercher un adhérent',
  choiceLabelRenderCallback = null,
  renderOption = null,
  initialParams = {},
}) => {
  const getOptionLabel =
    typeof choiceLabelRenderCallback === 'function'
      ? choiceLabelRenderCallback
      : value => (value ? `${value?.first_name} ${value?.last_name}` : '')

  const fullUri = Object.keys(initialParams).reduce((uri, key) => {
    const separator = uri.includes('?') ? '&' : '?'
    return `${uri}${separator}${key}=${initialParams[key]}`
  }, ADHERENT_AUTOCOMPLETE_URI)

  return (
    <Autocomplete
      multiple={multiple}
      required={required}
      placeholder={placeholder}
      customStyle={customStyle}
      uri={fullUri}
      queryParam="q"
      valueParam="uuid"
      value={value}
      onChange={onChange}
      renderOption={renderOption}
      getOptionLabel={getOptionLabel}
    />
  )
}

export default AdherentAutocomplete

AdherentAutocomplete.propTypes = {
  onChange: PropTypes.func.isRequired,
  renderOption: PropTypes.func,
  choiceLabelRenderCallback: PropTypes.func,
  placeholder: PropTypes.string,
  multiple: PropTypes.bool,
  required: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  customStyle: PropTypes.object,
  initialParams: PropTypes.object,
}
