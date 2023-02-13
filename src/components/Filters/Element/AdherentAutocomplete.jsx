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
}) => {
  const getOptionLabel =
    typeof choiceLabelRenderCallback === 'function'
      ? choiceLabelRenderCallback
      : value => (value ? `${value?.first_name} ${value?.last_name}` : '')

  return (
    <Autocomplete
      multiple={multiple}
      required={required}
      placeholder={placeholder}
      customStyle={customStyle}
      uri={ADHERENT_AUTOCOMPLETE_URI}
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

Autocomplete.propTypes = {
  onChange: PropTypes.func.isRequired,
  renderOption: PropTypes.func,
  choiceLabelRenderCallback: PropTypes.func,
  placeholder: PropTypes.string,
  multiple: PropTypes.bool,
  required: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  customStyle: PropTypes.object,
}
