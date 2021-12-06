import { useMemo, useEffect, useState } from 'react'
import { Autocomplete as MuiAutocomplete, TextField, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'
import { debounce } from 'lodash'
import { getDataFromDynamicEndpoint } from 'api/dynamic'

const useStyles = makeStyles(theme => ({
  root: {
    background: theme.palette.whiteCorner,
    borderRadius: '8.35px',
  },
}))

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
  autoCompleteStyle,
  getOptionLabel,
  renderOption,
  defaultValue,
  value,
}) => {
  const [inputValue, setInputValue] = useState(defaultValue[labelParam])
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const classes = useStyles()

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

  const handleInputChange = useMemo(
    () =>
      debounce((_, value) => {
        setInputValue(value)
      }, 500),
    []
  )

  useEffect(
    () => () => {
      handleInputChange.cancel()
    },
    [handleInputChange]
  )

  const handleChange = (_, selectedValues) => {
    const selectItems = [].concat(selectedValues).filter(selection => !!selection)
    if (multiple) return onChange(selectItems)
    return onChange(selectItems.shift() || {})
  }

  const Input = params => (
    <TextField {...params} variant="outlined" size="small" label={placeholder} required={required} fullWidth />
  )

  const defaultRenderOptions = (props, option) => (
    <li {...props} key={option[valueParam]}>
      <Typography size="small">{getOptionLabel(option)}</Typography>
    </li>
  )

  return (
    <MuiAutocomplete
      size="small"
      loadingText={messages.loading}
      noOptionsText={messages.noOptions}
      className={`${classes.root} ${autoCompleteStyle}`}
      multiple={multiple}
      open={open}
      loading={loading}
      options={options}
      value={value}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onChange={handleChange}
      onInputChange={handleInputChange}
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
  autoCompleteStyle: '',
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
  autoCompleteStyle: PropTypes.string,
  defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
}

export default Autocomplete
