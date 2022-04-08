import PropTypes from 'prop-types'
import Register from './step01/Register'
import PollingStationSelect from './step02/PollingStationSelect'

const RenderStep = ({ formik, step, values, errors, touched, handleBlur, handleChange }) => {
  switch (step) {
    case 2:
      return (
        <Register
          formik={formik}
          values={values}
          errors={errors}
          touched={touched}
          handleChange={handleChange}
          handleBlur={handleBlur}
        />
      )
    case 1:
      return <PollingStationSelect formik={formik} />
    default:
      return <Register errors={errors} touched={touched} />
  }
}

export default RenderStep

RenderStep.propTypes = {
  formik: PropTypes.object,
  step: PropTypes.number,
  values: PropTypes.object,
  errors: PropTypes.object,
  touched: PropTypes.object,
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func,
}
