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
  apiClient.get(`${uri}?${queryParam}=${query}`).then(callback)
}, 500)

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
    if (!defaultValue || (Array.isArray(defaultValue) && defaultValue.length === 0)) {
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

  return (
    <MuiAutocomplete
      options={options}
      open={open}
      value={value}
      size="small"
      className={`${classes.root} ${autoCompleteStyle}`}
      loading={loading}
      multiple={multiple}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onChange={(data, selectedValues) => {
        const selectItems = [].concat(selectedValues).filter(selection => !!selection)

        if (multiple) {
          return onChange(selectItems)
        }
        return onChange(selectItems.shift() || {})
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue)
      }}
      filterOptions={x => x}
      loadingText="Chargement…"
      noOptionsText="Aucun élément"
      renderInput={params => (
        <TextField variant="outlined" size="small" {...params} label={placeholder} fullWidth required={required} />
      )}
      autoComplete
      getOptionLabel={getOptionLabel}
      getOptionSelected={(option, selectedValue) => option[valueParam] === selectedValue[valueParam]}
      renderOption={option => <Typography size="small">{getOptionLabel(option)}</Typography>}
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
