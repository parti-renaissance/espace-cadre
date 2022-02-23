import MDEditor, { commands } from '@uiw/react-md-editor'
import PropTypes from 'prop-types'
import { useCallback } from 'react'

const TextIcon = ({ label, size }) => (
  <div style={{ fontSize: size, textAlign: 'left' }} title={label}>
    {label}
  </div>
)
TextIcon.propTypes = {
  label: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
}

const messages = {
  title: 'Titre',
  title1: 'Titre 1',
  title2: 'Titre 2',
  title3: 'Titre 3',
  title4: 'Titre 4',
  title5: 'Titre 5',
  title6: 'Titre 6',
  insertTitle: 'Insérer un titre',
  bold: 'Gras',
  italic: 'Italic',
  link: 'Lien',
  quote: 'Citation',
  image: 'Image',
  unorderedListCommand: 'Liste à puces',
  orderedListCommand: 'Liste numérotée',
}

const withLabel = (command, label) => ({
  ...command,
  buttonProps: { ...command.buttonProps, 'aria-label': label, title: label },
})
const withTextIcon = (command, label, size) => ({
  ...command,
  icon: <TextIcon size={19 - size} label={label} />,
})
const title = size => withTextIcon(commands[`title${size}`], messages[`title${size}`], size)
const titles = [title(1), title(2), title(3), title(4), title(5), title(6)]

const NewsEditor = ({ value, onChange }) => {
  const handleChange = useCallback(md => onChange(md.replace(/</g, '&lt;')), [onChange])

  return (
    <MDEditor
      value={value}
      onChange={handleChange}
      commands={[
        withLabel(
          commands.group(titles, {
            name: messages.title,
            groupName: messages.title,
          }),
          messages.insertTitle
        ),
        withLabel(commands.bold, messages.bold),
        withLabel(commands.italic, messages.italic),
        commands.divider,
        withLabel(commands.link, messages.link),
        withLabel(commands.quote, messages.quote),
        withLabel(commands.image, messages.image),
        commands.divider,
        withLabel(commands.unorderedListCommand, messages.unorderedListCommand),
        withLabel(commands.orderedListCommand, messages.orderedListCommand),
      ]}
    />
  )
}

NewsEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default NewsEditor
