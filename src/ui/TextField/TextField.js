import { TextField as TextFieldMui } from '@mui/material'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'
import AlertBanner from 'ui/AlertBanner'

const useStyles = makeStyles(theme => ({
  textField: {
    border: `1px solid ${theme.palette.gray200}`,
    borderRadius: '8px',
    margin: '8px 0',
  },
}))

const TextField = ({ formik, label }) => {
  const classes = useStyles()

  return (
    <>
      <TextFieldMui
        fullWidth
        className={classes.textField}
        size="small"
        variant="outlined"
        multiline={label === 'body'}
        id={label}
        name={label}
        inputProps={{ maxLength: 255 }}
        value={formik.values[label]}
        onChange={formik.handleChange}
      />
      {formik.touched[label] && formik.errors[label] && <AlertBanner severity="error" message={formik.errors[label]} />}
    </>
  )
}

export default TextField

TextField.propTypes = {
  formik: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
}
