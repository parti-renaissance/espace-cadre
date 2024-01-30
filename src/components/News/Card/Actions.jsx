import { CtaButton } from '~/ui/Card'
import { styled } from '@mui/system'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import EditIcon from '@mui/icons-material/EditRounded'
import BookmarkIcon from '@mui/icons-material/Bookmark'
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
  published: 'Publier',
  unPublished: 'Dépublier',
  pinned: 'Épingler',
  unpinned: 'Désépingler',
  edit: 'Modifier',
}

const Actions = ({ status, pinned, toggleStatus, togglePinned, handleEdit, statusLoader = false, onView }) => (
  <HorizontalContainer>
    <CtaButton onClick={onView}>{messages.see}</CtaButton>
    <DotsMenu>
      <DotsMenuItem onClick={toggleStatus} loader={statusLoader}>
        <VisibilityOffIcon sx={{ mr: 1, fontSize: '12px' }} />
        {status ? messages.unPublished : messages.published}
      </DotsMenuItem>
      <DotsMenuItem onClick={togglePinned} loader={statusLoader}>
        <BookmarkIcon sx={{ mr: 1, fontSize: '12px' }} />
        {pinned ? messages.unpinned : messages.pinned}
      </DotsMenuItem>
      <DotsMenuItem onClick={handleEdit}>
        <EditIcon sx={{ mr: 1, fontSize: '12px' }} />
        {messages.edit}
      </DotsMenuItem>
    </DotsMenu>
  </HorizontalContainer>
)

export default Actions

Actions.propTypes = {
  status: PropTypes.bool.isRequired,
  pinned: PropTypes.bool.isRequired,
  toggleStatus: PropTypes.func.isRequired,
  togglePinned: PropTypes.func.isRequired,
  statusLoader: PropTypes.bool,
  onView: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
}
