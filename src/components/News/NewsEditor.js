import Editor from 'ckeditor5-custom-build/build/ckeditor'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import PropTypes from 'prop-types'
import AlertBanner from 'ui/AlertBanner'
import { Grid } from '@mui/material'

const NewsEditor = ({ formik, label, readOnly, ...props }) => {
  if (readOnly) {
    return <CKEditor editor={Editor} {...props} />
  }
  return (
    <>
      <Grid sx={{ mb: 1 }}>
        <CKEditor error={!!formik.touched[label] && !!formik.errors[label]} editor={Editor} {...props} />
      </Grid>
      {formik && formik.touched[label] && formik.errors[label] && (
        <AlertBanner severity="error" message={formik.errors[label]} />
      )}
    </>
  )
}

NewsEditor.propTypes = {
  formik: PropTypes.object,
  label: PropTypes.string,
  readOnly: PropTypes.bool,
}

export default NewsEditor
