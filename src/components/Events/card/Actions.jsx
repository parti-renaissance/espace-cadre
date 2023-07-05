import { styled } from '@mui/system'
import { Box } from '@mui/material'
import PropTypes from 'prop-types'
import DotsMenu, { DotsMenuItem } from 'ui/Card/Menu/DotsMenu'
import Button from 'ui/Button/Button'
import { CtaButton } from 'ui/Card'

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
  onEdit,
  onView,
  onDelete,
  isDeletable,
  isEditable,
  onCancel,
  isCancelable,
  cancelLoader = false,
  deleteLoader = false,
}) => (
  <HorizontalContainer>
    <Box display="flex" alignItems="center" className="space-x-2">
      <CtaButton onClick={onView}>{messages.see}</CtaButton>
      {isEditable && <Button onClick={onEdit}>{messages.edit}</Button>}
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
  onEdit: PropTypes.func,
  onView: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isDeletable: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  isCancelable: PropTypes.bool.isRequired,
  cancelLoader: PropTypes.bool,
  deleteLoader: PropTypes.bool,
  isEditable: PropTypes.bool,
}
