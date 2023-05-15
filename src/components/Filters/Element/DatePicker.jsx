import PropTypes from 'prop-types'
import { useState } from 'react'
import { format } from 'date-fns'
import { styled } from '@mui/system'
import { IconButton, TextField as MuiTextField } from '@mui/material'
import { Clear as ClearIcon, Event as EventIcon } from '@mui/icons-material'
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers'

const TextField = styled(MuiTextField)`
  background: ${({ theme }) => theme.palette.whiteCorner};
  width: 100%;
  border-radius: 8px;

  & .MuiOutlinedInput-notchedOutline {
    border: none;
  }
`

const DatePicker = ({ value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleClear = e => {
    e.stopPropagation()
    onChange(null)
  }

  return (
    <MuiDatePicker
      openTo="day"
      inputFormat="dd/MM/yyyy"
      open={isOpen}
      label={label}
      value={value}
      onChange={date => {
        if (!date || isNaN(date) || date.getFullYear() < 1900) {
          onChange('')
        } else {
          onChange(format(date, 'yyyy-MM-dd'))
        }
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
