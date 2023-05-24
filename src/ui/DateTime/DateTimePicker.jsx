import PropTypes from 'prop-types'
import { InputAdornment } from '@mui/material'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { DateTimePicker as MuiDateTimePicker, DatePicker as MuiDatePicker } from '@mui/x-date-pickers'

import Input from 'ui/Input/Input'
import { PickersDay } from './styled'

const DateTimePicker = ({
  value,
  onChange,
  name = '',
  minDate,
  placeholder = '',
  withTime = false,
  slotProps = {},
  ...props
}) => {
  const dateFormat = withTime ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy'
  const defaultSlotProps = {
    textField: {
      variant: 'outlined',
      InputProps: {
        placeholder,
        autoComplete: 'off',
      },
    },
    ...slotProps,
  }
  const defaultProps = {
    adapterLocale: 'fr',
    value: format(new Date(value), dateFormat, { locale: fr }),
    name,
    onChange,
    minDate,
  }

  return withTime ? (
    <MuiDateTimePicker
      format={dateFormat}
      slots={{ day: PickersDay, textField: Input }}
      slotProps={{
        inputAdornment: {
          position: 'start',
          component: ({ children, ...props }) => (
            <InputAdornment position="start" sx={{ pl: 2 }} {...props}>
              {children}
            </InputAdornment>
          ),
        },
        ...defaultSlotProps,
      }}
      {...defaultProps}
      {...props}
    />
  ) : (
    <MuiDatePicker
      format={dateFormat}
      slots={{ textField: Input }}
      slotProps={slotProps}
      {...defaultSlotProps}
      {...props}
    />
  )
}

DateTimePicker.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  minDate: PropTypes.object,
  withTime: PropTypes.bool,
  slotProps: PropTypes.object,
}

export default DateTimePicker
