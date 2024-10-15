import { Control, Controller, UseFormRegister, UseFormSetError } from 'react-hook-form'
import { DateTimePicker as MuiDateTimePicker } from '@mui/x-date-pickers'

type DateTimePickerProps = {
  name: string
  register: UseFormRegister<any>
  control: Control<any>
  setError: UseFormSetError<any>
  label: string
  disabled?: boolean
}

const DateTimePicker = ({ name, control, register, setError, ...props }: DateTimePickerProps) => (
  <Controller
    control={control}
    name={name}
    rules={{ required: true }}
    render={({ field, fieldState: { error } }) => (
      <MuiDateTimePicker
        value={field.value}
        onClose={field.onBlur}
        inputRef={field.ref}
        ref={register(name).ref}
        onChange={field.onChange}
        onError={error =>
          setError(name, {
            message: !error ? undefined : error === 'minutesStep' ? 'Les minutes doivent être 0 ou 30.' : error,
          })
        }
        minutesStep={30}
        sx={{ width: '100%' }}
        slotProps={{
          textField: {
            onBlur: field.onBlur,
            error: !!error,
            helperText: error ? <>{error.message}</> : null,
          },
        }}
        {...props}
      />
    )}
  />
)

export default DateTimePicker
