import PropTypes from 'prop-types'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import TurndownService from 'turndown'

const tdService = new TurndownService()

const NewsEditor = ({ value, onChange }) => (
  <CKEditor
    editor={ClassicEditor}
    config={{
      toolbar: {
        items: [
          'heading',
          'bold',
          'italic',
          '|',
          'numberedList',
          'bulletedList',
          '|',
          'link',
          'blockQuote',
          '|',
          'undo',
          'redo',
        ],
      },
    }}
    data={value}
    onChange={(_, editor) => {
      const data = editor.getData()
      onChange(tdService.turndown(data))
    }}
  />
)

NewsEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default NewsEditor
