import Editor from 'ckeditor5-custom-build/build/ckeditor'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import PropTypes from 'prop-types'
import AlertBanner from 'ui/AlertBanner'
import { Grid } from '@mui/material'

const NewsEditor = ({ formik, label, onChange, onReady, config }) => (
  <>
    <Grid sx={{ mb: 1 }}>
      <CKEditor
        error={!!formik.touched[label] && !!formik.errors[label]}
        editor={Editor}
        config={config}
        data={formik.values[label]}
        onChange={onChange}
        onReady={onReady}
      />
    </Grid>
    {formik.touched[label] && formik.errors[label] && <AlertBanner severity="error" message={formik.errors[label]} />}
  </>
)

NewsEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onReady: PropTypes.func,
  config: PropTypes.object,
  formik: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
}

export default NewsEditor
