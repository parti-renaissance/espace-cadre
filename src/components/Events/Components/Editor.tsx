// src/Tiptap.tsx
import { useEditor, EditorContent, FloatingMenu, BubbleMenu, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useDebouncedCallback } from 'use-debounce'

// define your extension array
const extensions = [StarterKit]

const parseJsonEditorContent = (x: string) => {
  try {
    return JSON.parse(x)
  } catch (_) {
    return x
  }
}

type Payloads = {
  html: string
  pure: string
  json: string
}

const MyEditor = (props: { onChange: (x: Payloads) => void; onBlur: () => void; value: Payloads; label: string }) => {
  const handleOnChange = useDebouncedCallback((x: { editor: Editor }) => {
    props?.onChange({
      html: x.editor.getHTML() ?? '',
      pure: x.editor.getText() ?? '',
      json: JSON.stringify(x.editor.getJSON() ?? {}),
    })
  }, 200)

  const editor = useEditor({
    extensions,
    content: parseJsonEditorContent(props.value.json),
    onUpdate: handleOnChange,
    editorProps: {
      attributes: {
        class: '',
      },
    },
    onBlur: props?.onBlur,
  })

  if (editor === null) {
    return null
  }

  return (
    <div>
      <div className="tip-tap-toolbar">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
        >
          <img src="/editor-icons/bold.png" alt="Bold" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
        >
          <img src="/editor-icons/italic.png" alt="Italic" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
        >
          <img src="/editor-icons/ul.png" alt="Bullet List" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
        >
          <img src="/editor-icons/ol.png" alt="Ordered List" />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}

export default MyEditor
