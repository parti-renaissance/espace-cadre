import PropTypes from 'prop-types'
import { useState } from 'react'
import { format } from 'date-fns'
import { IconButton, TextField } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Clear as ClearIcon, Event as EventIcon } from '@mui/icons-material'
import MuiDatePicker from '@mui/lab/DatePicker'

const useStyles = makeStyles(theme => ({
  input: {
    background: theme.palette.whiteCorner,
    width: '100%',
    borderRadius: '8px',

    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
  },
}))

const DatePicker = ({ value, onChange, label }) => {
  const classes = useStyles()
  const [isOpen, setIsOpen] = useState(false)

  const handleClear = e => {
    e.stopPropagation()
    onChange(null)
  }

  return (
    <MuiDatePicker
      openTo="year"
      inputFormat="dd/MM/yyyy"
      open={isOpen}
      label={label}
      value={value}
      onChange={date => {
        onChange(format(date, 'yyyy-MM-dd'))
      }}
      onClose={() => {
        setIsOpen(false)
      }}
      renderInput={props => (
        <TextField
          {...props}
          variant="outlined"
          size="small"
          label={label}
          value={value}
          className={classes.input}
          onChange={e => {
            onChange(e.target.value)
          }}
          InputProps={{
            endAdornment: (() => (
              <IconButton size="small" onClick={value ? handleClear : () => setIsOpen(true)}>
                {value ? <ClearIcon /> : <EventIcon />}
              </IconButton>
            ))(),
          }}
        />
      )}
    />
  )
}

DatePicker.defaultProps = {
  value: null,
}

DatePicker.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
}

export default DatePicker
