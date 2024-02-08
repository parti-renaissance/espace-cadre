import { CtaButton } from '~/ui/Card'
import { styled } from '@mui/system'
import { generatePath, useNavigate } from 'react-router-dom'
import { paths as messageriePaths } from '~/components/Messagerie/shared/paths'
import PropTypes from 'prop-types'
import DotsMenu, { DotsMenuItem } from '~/ui/Card/Menu/DotsMenu'

const HorizontalContainer = styled('div')`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
`

const messages = {
  update: 'Modifier',
  preview: 'Prévisualiser',
  delete: 'Supprimer',
}

const Actions = ({ messageId, onDelete, onPreview = null, loader = false, isEditEnabled = true }) => {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate(generatePath(':messageId/' + messageriePaths.update, { messageId }))
  }

  return (
    <HorizontalContainer>
      <div>{isEditEnabled && <CtaButton onClick={handleClick}>{messages.update}</CtaButton>}</div>
      {(typeof onPreview === 'function' || typeof onDelete === 'function') && (
        <DotsMenu>
          {typeof onPreview === 'function' && <DotsMenuItem onClick={onPreview}>{messages.preview}</DotsMenuItem>}
          {typeof onDelete === 'function' && (
            <DotsMenuItem onClick={onDelete} loader={loader}>
              {messages.delete}
            </DotsMenuItem>
          )}
        </DotsMenu>
      )}
    </HorizontalContainer>
  )
}

export default Actions

Actions.propTypes = {
  messageId: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
  onPreview: PropTypes.func,
  loader: PropTypes.bool,
  isEditEnabled: PropTypes.bool,
}
