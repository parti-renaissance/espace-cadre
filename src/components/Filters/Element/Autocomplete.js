import { useEffect, useState } from 'react'
import { Autocomplete as MuiAutocomplete, TextField, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'
import { throttle } from 'lodash'
import { apiClient } from 'services/networking/client'

const useStyles = makeStyles(theme => ({
  root: {
    background: theme.palette.whiteCorner,
    borderRadius: '8.35px',
  },
}))

const fetch = throttle((uri, queryParam, query, callback) => {
  const separator = uri.includes('?') ? '&' : '?'
  apiClient.get(`${uri}${separator}${queryParam}=${query}`).then(callback)
}, 500)

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
  defaultValue,
  value,
}) => {
  const [inputValue, setInputValue] = useState(defaultValue[labelParam])
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const classes = useStyles()

  useEffect(() => {
    if (!defaultValue || !inputValue || (Array.isArray(defaultValue) && defaultValue.length === 0)) {
      return
    }
    fetch(uri, queryParam, inputValue, data => {
      const choice = data.filter(d => d[valueParam] === defaultValue[valueParam])
      setOptions(choice)
      setLoading(false)
    })
  }, [uri, queryParam, defaultValue, inputValue, valueParam])

  useEffect(() => {
    if (!inputValue) {
      setOptions([])
      return
    }

    setLoading(true)

    fetch(uri, queryParam, inputValue, data => {
      setOptions(data)
      setLoading(false)
    })
  }, [uri, queryParam, inputValue])

  const handleChange = (_, selectedValues) => {
    const selectItems = [].concat(selectedValues).filter(selection => !!selection)
    if (multiple) return onChange(selectItems)
    return onChange(selectItems.shift() || {})
  }

  const Input = params => (
    <TextField {...params} variant="outlined" size="small" label={placeholder} required={required} fullWidth />
  )

  const Option = (props, option) => (
    <li {...props}>
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
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue)
      }}
      filterOptions={x => x}
      renderInput={Input}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option, selectedValue) => option[valueParam] === selectedValue[valueParam]}
      renderOption={Option}
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
  placeholder: PropTypes.string,
  multiple: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  required: PropTypes.bool,
  autoCompleteStyle: PropTypes.string,
  defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
}

export default Autocomplete
