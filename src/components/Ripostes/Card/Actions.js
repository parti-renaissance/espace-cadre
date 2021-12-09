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
  activate: 'Activer',
  deactivate: 'Désactiver',
  edit: 'Éditer',
}

const Actions = ({ status, toggleStatus, onEdit }) => (
  <HorizontalContainer>
    <CtaButton
      onClick={onEdit}
      sx={{
        color: 'teal700',
        '&:hover': {
          bgcolor: 'riposteBackground',
        },
      }}
    >
      {messages.edit}
    </CtaButton>
    <DotsMenu>
      <DotsMenuItem onClick={toggleStatus}>{status ? messages.deactivate : messages.activate}</DotsMenuItem>
    </DotsMenu>
  </HorizontalContainer>
)

export default Actions

Actions.propTypes = {
  status: PropTypes.bool.isRequired,
  toggleStatus: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
}
