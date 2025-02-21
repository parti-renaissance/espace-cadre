import { useEditor, EditorContent, Editor } from '@tiptap/react'
import Link from '@tiptap/extension-link'
import StarterKit from '@tiptap/starter-kit'
import { useDebouncedCallback } from 'use-debounce'
import { useState } from 'react'

// define your extension array
const extensions = [
  StarterKit,
  Link.configure({
    openOnClick: false,
  }),
]

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
  const [linkUrl, setLinkUrl] = useState('')
  const [isLinkMenuOpen, setIsLinkMenuOpen] = useState(false)

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
    onBlur: props?.onBlur,
  })

  if (editor === null) {
    return null
  }

  const setLink = () => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
    }
    setLinkUrl('')
    setIsLinkMenuOpen(false)
  }

  const unlink = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
    setIsLinkMenuOpen(false)
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
        <div className="link-controls">
          <button
            type="button"
            onClick={() => {
              const previousUrl = editor.getAttributes('link').href
              setLinkUrl(previousUrl || '')
              setIsLinkMenuOpen(!isLinkMenuOpen)
            }}
            className={`link-button ${isLinkMenuOpen ? 'is-active' : ''}`}
          >
            <img src="/editor-icons/link.png" alt="Link" />
          </button>
          {isLinkMenuOpen && (
            <div className="link-menu">
              <input type="text" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="Enter URL" />
              <button type="button" onClick={setLink}>
                Ajouter
              </button>
              {linkUrl ? (
                <button type="button" onClick={unlink}>
                  Supprimer
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}

export default MyEditor
