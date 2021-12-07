import CtaButton from 'ui/Card/CtaButton/CtaButton'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import DotsMenu from 'ui/Card/Menu/DotsMenu'

const Horizontal = styled('div')`
  display: flex;
  flex: 1;
  align-items: end;
  justify-content: space-between;
`

const messages = {
  activate: 'Activer',
  deactivate: 'Désactiver',
  edit: 'Éditer',
}

const Actions = ({ status, toggleStatus, onEdit }) => (
  <Horizontal>
    <CtaButton
      onClick={onEdit}
      sx={{
        color: 'teal700',
        '&:hover': {
          backgroundColor: 'riposteBackground',
        },
      }}
    >
      {messages.edit}
    </CtaButton>
    <DotsMenu>
      <DotsMenu.Item onClick={toggleStatus}>{status ? messages.deactivate : messages.activate}</DotsMenu.Item>
    </DotsMenu>
  </Horizontal>
)

export default Actions

Actions.propTypes = {
  status: PropTypes.bool.isRequired,
  toggleStatus: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
}
