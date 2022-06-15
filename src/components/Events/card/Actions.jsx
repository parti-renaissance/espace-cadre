import PropTypes from 'prop-types'
import { CtaButton } from 'ui/Card'
import { styled } from '@mui/system'
import DotsMenu, { DotsMenuItem } from 'ui/Card/Menu/DotsMenu'

const HorizontalContainer = styled('div')`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
`

const messages = {
  see: 'Voir',
  cancel: 'Annuler',
  edit: 'Modifier',
  delete: 'Supprimer',
}

const Actions = ({
  event,
  onView,
  isCancelable,
  onCancel,
  cancelLoader = false,
  onEdit,
  isDeletable,
  onDelete,
  deleteLoader = false,
}) => (
  <HorizontalContainer>
    <CtaButton onClick={onView}>{messages.see}</CtaButton>
    {(isCancelable || isDeletable) && (
      <DotsMenu>
        {isCancelable && (
          <DotsMenuItem onClick={onCancel} cancelLoader={cancelLoader}>
            {messages.cancel}
          </DotsMenuItem>
        )}
        {event?.scheduled && <DotsMenuItem onClick={onEdit}>{messages.edit}</DotsMenuItem>}
        {isDeletable && (
          <DotsMenuItem onClick={onDelete} deleteLoader={deleteLoader}>
            {messages.delete}
          </DotsMenuItem>
        )}
      </DotsMenu>
    )}
  </HorizontalContainer>
)

export default Actions

Actions.propTypes = {
  event: PropTypes.object.isRequired,
  onView: PropTypes.func.isRequired,
  isCancelable: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  cancelLoader: PropTypes.bool,
  onEdit: PropTypes.func.isRequired,
  isDeletable: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
  deleteLoader: PropTypes.bool,
}
