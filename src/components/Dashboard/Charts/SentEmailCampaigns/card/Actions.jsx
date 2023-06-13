import { CtaButton } from 'ui/Card'
import { styled } from '@mui/system'
import { generatePath, useNavigate } from 'react-router-dom'
import { paths as messageriePaths } from 'components/Messagerie/shared/paths'
import PropTypes from 'prop-types'
import DotsMenu, { DotsMenuItem } from 'ui/Card/Menu/DotsMenu'

const HorizontalContainer = styled('div')`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
`

const messages = {
  update: 'Modifier',
  delete: 'Supprimer',
}

const Actions = ({ messageId, del, loader = false, isMailsStatutory = false }) => {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate(generatePath(':messageId/' + messageriePaths.update, { messageId }))
  }

  return (
    <HorizontalContainer>
      <CtaButton onClick={handleClick} disabled={isMailsStatutory}>
        {messages.update}
      </CtaButton>
      <DotsMenu>
        <DotsMenuItem onClick={del} loader={loader}>
          {messages.delete}
        </DotsMenuItem>
      </DotsMenu>
    </HorizontalContainer>
  )
}

export default Actions

Actions.propTypes = {
  messageId: PropTypes.string.isRequired,
  del: PropTypes.func.isRequired,
  loader: PropTypes.bool,
  isMailsStatutory: PropTypes.bool,
}
