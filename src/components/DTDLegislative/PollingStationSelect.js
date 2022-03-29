import TextField from 'ui/TextField'

const PollingStationSelect = ({ formik, values, handleChange, handleSubmit, back, errors, touched, handleBlur }) => {
  const firstNameHasError = errors.firstName && touched.firstName
  const lastNameHasError = errors.lastName && touched.lastName

  return (
    <>
      <TextField
        formik={formik}
        label="firstName"
        placeholder="firstname"
        onBlur={handleBlur}
        defaultValue={values.firstName}
        onChange={handleChange}
        error={firstNameHasError}
      />
      <br />
      <TextField
        formik={formik}
        label="lastName"
        placeholder="lastName"
        onBlur={handleBlur}
        defaultValue={values.lastName}
        onChange={handleChange}
        error={lastNameHasError}
      />
      <br />
      <button
        disabled={!touched.firstName || !touched.lastName || lastNameHasError || firstNameHasError}
        onClick={handleSubmit}
      >
        Submit
      </button>
    </>
  )
}

export default PollingStationSelect
