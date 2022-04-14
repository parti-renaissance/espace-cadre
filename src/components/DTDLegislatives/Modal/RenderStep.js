import PropTypes from 'prop-types'
import Register from './step01/Register'
import PollingStationSelect from './step02/PollingStationSelect'

const RenderStep = ({
  formik,
  step,
  values,
  formikErrors,
  errorMessages,
  touched,
  handleBlur,
  handleChange,
  campaignId,
}) => {
  switch (step) {
    case 1:
      return (
        <Register
          formik={formik}
          values={values}
          formikErrors={formikErrors}
          touched={touched}
          handleChange={handleChange}
          handleBlur={handleBlur}
          errorMessages={errorMessages}
        />
      )
    case 2:
      return <PollingStationSelect formik={formik} campaignId={campaignId} errorMessages={errorMessages} />
    default:
      return <Register formikErrors={formikErrors} errorMessages={errorMessages} touched={touched} />
  }
}

export default RenderStep

RenderStep.propTypes = {
  formik: PropTypes.object,
  step: PropTypes.number,
  values: PropTypes.object,
  formikErrors: PropTypes.object,
  errorMessages: PropTypes.array,
  touched: PropTypes.object,
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func,
  campaignId: PropTypes.string,
}
