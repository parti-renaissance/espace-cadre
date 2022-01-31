import { CtaButton } from 'ui/Card'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import DotsMenu, { DotsMenuItem } from 'ui/Card/Menu/DotsMenu'

const HorizontalContainer = styled('div')`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
`

const messages = {
  see: 'Voir',
  delete: 'Supprimer',
  cancel: 'Annuler',
}

const Actions = ({ onView, onDelete, isDeletable, onCancel, isCancelable, loader = false }) => (
  <HorizontalContainer>
    <CtaButton onClick={onView}>{messages.see}</CtaButton>
    {(isCancelable || isDeletable) && (
      <DotsMenu>
        {isCancelable && (
          <DotsMenuItem onClick={onCancel} loader={loader}>
            {messages.cancel}
          </DotsMenuItem>
        )}
        {isDeletable && (
          <DotsMenuItem onClick={onDelete} loader={loader}>
            {messages.delete}
          </DotsMenuItem>
        )}
      </DotsMenu>
    )}
  </HorizontalContainer>
)

export default Actions

Actions.propTypes = {
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isDeletable: PropTypes.bool.isRequired,
  isCancelable: PropTypes.bool.isRequired,
  loader: PropTypes.bool,
}
