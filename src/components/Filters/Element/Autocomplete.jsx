import { useEffect, useState } from 'react'
import { Autocomplete as MuiAutocomplete, TextField, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { styled } from '@mui/system'

import { getDataFromDynamicEndpoint } from 'api/dynamic'
import { useDebounce } from 'components/shared/debounce'

const AutocompleteComponent = styled(MuiAutocomplete)(
  ({ theme }) => `
  background: ${theme.palette.whiteCorner};
  border-radius: 8px;
`
)

const messages = {
  loading: 'Chargement…',
  noOptions: 'Aucun élément',
}

const Autocomplete = ({
  uri,
  placeholder,
  queryParam,
  valueParam,
  labelParam,
  multiple,
  onChange,
  required,
  customStyle,
  getOptionLabel,
  renderOption,
  defaultValue,
  value,
}) => {
  const [inputValue, setInputValue] = useState(defaultValue[labelParam])
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const debounce = useDebounce()

  useEffect(() => {
    if (!inputValue) {
      setOptions([])
      return
    }
    setLoading(true)
    getDataFromDynamicEndpoint({ uri, queryParam, query: inputValue }, data => {
      setOptions(data)
      setLoading(false)
    })
  }, [inputValue, uri, queryParam])

  const handleChange = (_, selectedValues) => {
    const selectItems = [].concat(selectedValues).filter(selection => !!selection)
    return onChange(multiple ? selectItems : selectItems.shift())
  }

  const Input = params => (
    <TextField {...params} variant="outlined" size="small" label={placeholder} required={required} fullWidth />
  )

  const defaultRenderOptions = (props, option) => (
    <li {...props} key={option[valueParam]} data-cy="autocomplete-item">
      <Typography size="small">{getOptionLabel(option)}</Typography>
    </li>
  )

  return (
    <AutocompleteComponent
      size="small"
      loadingText={messages.loading}
      noOptionsText={messages.noOptions}
      sx={customStyle}
      multiple={multiple}
      open={open}
      loading={loading}
      options={options}
      value={value}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onChange={handleChange}
      onInputChange={(_, value) => debounce(() => setInputValue(value))}
      filterOptions={x => x}
      renderInput={Input}
      getOptionLabel={getOptionLabel}
      renderOption={renderOption || defaultRenderOptions}
      isOptionEqualToValue={(option, selectedValue) => option[valueParam] === selectedValue[valueParam]}
      autoComplete
    />
  )
}

Autocomplete.defaultProps = {
  placeholder: '',
  multiple: false,
  value: null,
  required: false,
  customStyle: {},
  defaultValue: {},
  labelParam: '',
}

Autocomplete.propTypes = {
  uri: PropTypes.string.isRequired,
  queryParam: PropTypes.string.isRequired,
  valueParam: PropTypes.string.isRequired,
  labelParam: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  getOptionLabel: PropTypes.func.isRequired,
  renderOption: PropTypes.func,
  placeholder: PropTypes.string,
  multiple: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  required: PropTypes.bool,
  customStyle: PropTypes.object,
  defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
}

export default Autocomplete
