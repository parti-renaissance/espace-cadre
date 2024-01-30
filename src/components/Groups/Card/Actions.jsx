import { CtaButton } from '~/ui/Card'
import { styled } from '@mui/system'
import { generatePath, useNavigate } from 'react-router-dom'
import paths from '../shared/paths'
import PropTypes from 'prop-types'
import DotsMenu, { DotsMenuItem } from '~/ui/Card/Menu/DotsMenu'

const HorizontalContainer = styled('div')`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
`

const messages = {
  see: 'Voir',
  edit: 'Modifier',
  delete: 'Supprimer',
}

const Actions = ({ groupId, onEdit, onDelete, isDeletable }) => {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate(generatePath(`:groupId/${paths.update}`, { groupId }))
  }

  return (
    <HorizontalContainer>
      <CtaButton onClick={handleClick}>{messages.see}</CtaButton>
      <DotsMenu>
        <DotsMenuItem onClick={onEdit}>{messages.edit}</DotsMenuItem>
        {isDeletable && <DotsMenuItem onClick={onDelete}>{messages.delete}</DotsMenuItem>}
      </DotsMenu>
    </HorizontalContainer>
  )
}

export default Actions

Actions.propTypes = {
  groupId: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isDeletable: PropTypes.bool.isRequired,
}
