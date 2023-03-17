import { PickersDay } from './styled'
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded'
import { InputAdornment } from '@mui/material'

import { DateTimePicker as MuiDateTimePicker } from '@mui/x-date-pickers'
import { useState } from 'react'
import PropTypes from 'prop-types'
import Input from 'ui/Input/Input'

const DateTimePicker = ({ value, onChange, name, minDate, placeholder = '', ...props }) => {
  const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false)

  return (
    <MuiDateTimePicker
      inputFormat="dd/MM/yyyy HH:mm"
      open={isStartDatePickerOpen}
      value={value}
      onChange={onChange}
      minDate={minDate}
      renderDay={(_, __, props) => <PickersDay {...props} />}
      renderInput={props => <Input type="date" name={name} {...props} />}
      inputProps={{ placeholder, autoComplete: 'off' }}
      InputProps={{
        onClick: () => {
          setIsStartDatePickerOpen(true)
        },
      }}
      onClose={() => {
        setIsStartDatePickerOpen(false)
      }}
      components={{ OpenPickerIcon: props => <CalendarTodayRoundedIcon size="small" {...props} /> }}
      InputAdornmentProps={{
        position: 'start',
        component: ({ children, ...props }) => (
          <InputAdornment position="start" sx={{ pl: 2 }} {...props}>
            {children}
          </InputAdornment>
        ),
      }}
      {...props}
    />
  )
}

DateTimePicker.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  minDate: PropTypes.object,
}

export default DateTimePicker
