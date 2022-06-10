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

const Actions = ({
  onView,
  onDelete,
  isDeletable,
  onCancel,
  isCancelable,
  cancelLoader = false,
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
  onView: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isDeletable: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  isCancelable: PropTypes.bool.isRequired,
  cancelLoader: PropTypes.bool,
  deleteLoader: PropTypes.bool,
}
