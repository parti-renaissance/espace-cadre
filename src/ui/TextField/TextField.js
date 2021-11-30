import { TextField as MuiTextField } from '@mui/material'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import AlertBanner from 'ui/AlertBanner'

const TextInput = styled(MuiTextField)(
  ({ theme }) => `
  border-color: ${theme.palette.gray200};
  border-radius: 8px;
  margin: ${theme.spacing(1, 0)};
`
)

const TextField = ({ formik, label, isLong }) => (
  <>
    <TextInput
      error={!!formik.touched[label] && !!formik.errors[label]}
      fullWidth
      size="small"
      variant="outlined"
      multiline={label === 'body'}
      id={label}
      name={label}
      inputProps={{ maxLength: isLong ? 1000 : 255 }}
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
  isLong: PropTypes.bool,
}
