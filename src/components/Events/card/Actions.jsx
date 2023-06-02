import { CtaButton } from 'ui/Card'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import DotsMenu, { DotsMenuItem } from 'ui/Card/Menu/DotsMenu'
import { Box } from '@mui/material'

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
  onEdit,
  onView,
  onDelete,
  isDeletable,
  onCancel,
  isCancelable,
  cancelLoader = false,
  deleteLoader = false,
  currentView,
}) => (
  <HorizontalContainer>
    <Box display="flex" alignItems="center" className="space-x-1">
      <CtaButton onClick={onView}>{messages.see}</CtaButton>
      {currentView === 'myEvents' && event?.scheduled && <CtaButton onClick={onEdit}>{messages.edit}</CtaButton>}
    </Box>
    {(isCancelable || isDeletable) && (
      <DotsMenu>
        {isCancelable && (
          <DotsMenuItem onClick={onCancel} cancelLoader={cancelLoader}>
            {messages.cancel}
          </DotsMenuItem>
        )}
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
  onEdit: PropTypes.func,
  onView: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isDeletable: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  isCancelable: PropTypes.bool.isRequired,
  cancelLoader: PropTypes.bool,
  deleteLoader: PropTypes.bool,
  currentView: PropTypes.string,
}
