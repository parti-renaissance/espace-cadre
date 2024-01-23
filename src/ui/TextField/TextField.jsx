import { TextField as MuiTextField } from '@mui/material'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import AlertBanner from '~/ui/AlertBanner'

const TextInput = styled(MuiTextField)(
  ({ theme }) => `
  border-radius: 8px;
  margin: ${theme.spacing(1, 0)};

  & .MuiOutlinedInput-root {
    border-radius: 8px;
  }
`
)

const TextField = ({ formik, label, inputProps = { maxLength: 255 }, ...props }) => (
  <>
    <TextInput
      {...props}
      error={!!formik.touched[label] && !!formik.errors[label]}
      fullWidth
      size="medium"
      variant="outlined"
      multiline={label === 'body'}
      id={label}
      name={label}
      inputProps={inputProps}
      value={formik.values[label]}
      onChange={formik.handleChange}
    />
    {formik.touched[label] && formik.errors[label] && <AlertBanner severity="error" message={formik.errors[label]} />}
  </>
)

export default TextField

TextField.propTypes = {
  formik: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  inputProps: PropTypes.object,
}
