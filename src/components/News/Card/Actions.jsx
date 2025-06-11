import { CtaButton } from '~/ui/Card'
import { styled } from '@mui/system'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import EditIcon from '@mui/icons-material/EditRounded'
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
  edit: 'Modifier',
}

const Actions = ({ status, toggleStatus, handleEdit, statusLoader = false, onView }) => (
  <HorizontalContainer>
    <CtaButton onClick={onView}>{messages.see}</CtaButton>
    <DotsMenu>
      <DotsMenuItem onClick={toggleStatus} loader={statusLoader}>
        <VisibilityOffIcon sx={{ mr: 1, fontSize: '12px' }} />
        {status ? messages.unPublished : messages.published}
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
  toggleStatus: PropTypes.func.isRequired,
  statusLoader: PropTypes.bool,
  onView: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
}
