import { CtaButton } from 'ui/Card'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import DotsMenu from 'ui/Card/Menu/DotsMenu'

const HorizontalContainer = styled('div')`
  display: flex;
  flex: 1;
  align-items: flex-end;
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
      <DotsMenu.Item onClick={toggleStatus}>{status ? messages.deactivate : messages.activate}</DotsMenu.Item>
    </DotsMenu>
  </HorizontalContainer>
)

export default Actions

Actions.propTypes = {
  status: PropTypes.bool.isRequired,
  toggleStatus: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
}
