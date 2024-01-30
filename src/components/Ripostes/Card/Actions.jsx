import { CtaButton } from '~/ui/Card'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import DotsMenu, { DotsMenuItem } from '~/ui/Card/Menu/DotsMenu'

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

const Actions = ({ status, toggleStatus, loader = false, onEdit }) => (
  <HorizontalContainer>
    <CtaButton onClick={onEdit}>{messages.edit}</CtaButton>
    <DotsMenu>
      <DotsMenuItem onClick={toggleStatus} loader={loader}>
        {status ? messages.deactivate : messages.activate}
      </DotsMenuItem>
    </DotsMenu>
  </HorizontalContainer>
)

export default Actions

Actions.propTypes = {
  status: PropTypes.bool.isRequired,
  toggleStatus: PropTypes.func.isRequired,
  loader: PropTypes.bool,
  onEdit: PropTypes.func.isRequired,
}
