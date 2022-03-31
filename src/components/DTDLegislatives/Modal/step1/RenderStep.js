import PropTypes from 'prop-types'
import Register from './Register'
import PollingStationSelect from '../step2/PollingStationSelect'

const RenderStep = ({ formik, step, values, errors, touched, handleBlur, handleChange }) => {
  switch (step) {
    case 1:
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
    case 2:
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
