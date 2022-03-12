import Editor from 'ckeditor5-custom-build/build/ckeditor'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import PropTypes from 'prop-types'

const NewsEditor = ({ value, onChange, onReady, config }) => (
  <CKEditor editor={Editor} config={config} data={value} onChange={onChange} onReady={onReady} />
)

NewsEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onReady: PropTypes.func,
  config: PropTypes.object,
}

export default NewsEditor
