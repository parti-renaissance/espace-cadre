import PropTypes from 'prop-types'
import { TextField } from '@mui/material'
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers'

const DatePicker = ({ value, onChange, label }) => (
  <MuiDatePicker
    openTo="day"
    inputFormat="dd/MM/yyyy"
    value={value}
    onChange={newValue => {
      if (newValue instanceof Date) {
        const offset = -newValue.getTimezoneOffset()
        newValue.setHours(Math.trunc(offset / 60), offset % 60)
      }

      onChange(newValue)
    }}
    slots={{ textField: TextField }}
    slotProps={{
      textField: {
        variant: 'outlined',
        label,
        InputProps: {
          autoComplete: 'off',
        },
      },
    }}
  />
)

DatePicker.defaultProps = {
  value: null,
}

DatePicker.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
}

export default DatePicker
