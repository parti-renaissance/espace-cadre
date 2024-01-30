import Editor from 'jme-ckeditor5/build/ckeditor'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import PropTypes from 'prop-types'
import AlertBanner from '~/ui/AlertBanner'
import { Grid } from '@mui/material'

const MarkdownEditor = ({ formik, label, readOnly, ...props }) => {
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

MarkdownEditor.propTypes = {
  formik: PropTypes.object,
  label: PropTypes.string,
  readOnly: PropTypes.bool,
}

export default MarkdownEditor
