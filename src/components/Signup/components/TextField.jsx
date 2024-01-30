import { TextField as MuiTextField } from '@mui/material'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import AlertBanner from '~/ui/AlertBanner'

const TextInput = styled(MuiTextField)(
  ({ theme }) => `
  border-radius: 8px;
  outline: none;
  color: ${theme.palette.blackCorner};
  background-color: ${theme.palette.gray100};
  
  & .MuiOutlinedInput-notchedOutline {
    border: none;
  }
`
)

export const TextFieldFormik = ({ formik, label, inputProps = { maxLength: 255 }, ...props }) => (
  <>
    <TextInput
      {...props}
      size="medium"
      error={!!formik.touched[label] && !!formik.errors[label]}
      fullWidth
      id={label}
      name={label}
      inputProps={inputProps}
      value={formik.values[label]}
      onChange={formik.handleChange}
    />
    {formik.touched[label] && formik.errors[label] && <AlertBanner severity="error" message={formik.errors[label]} />}
  </>
)

TextFieldFormik.propTypes = {
  formik: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  inputProps: PropTypes.object,
}

export const TextField = ({ value = '', inputProps = { maxLength: 255 }, onChange = () => {}, ...props }) => (
  <TextInput {...props} size="medium" inputProps={inputProps} value={value} onChange={onChange} />
)

TextField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  inputProps: PropTypes.object,
}
